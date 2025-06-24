import { NextRequest, NextResponse } from 'next/server';
import { getCountry } from '@/lib/ipUtils';
import {validateContactDetails, validateDate, ContactMethod} from "@/shared/validation";

type FormResponse = {
  success: boolean;
  message: string;
};

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('reCAPTCHA secret key is not configured');
      return false;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

async function sendTelegramMessage(text: string, orderId: string): Promise<Response> {

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials are not configured');
    throw new Error('Telegram credentials are not configured');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: '✅ Принять заказ',
                callback_data: `accept_order:${orderId}`
              },
              {
                text: '❌ Отклонить заказ',
                callback_data: `reject_order:${orderId}`
              }
            ]
          ]
        })
      }),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', responseData);
    }
    
    return response;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<FormResponse>> {
  try {

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'Неизвестный IP';

    const country = getCountry(ip);

    const formData = await request.formData();
    const recaptchaToken = formData.get('recaptchaToken') as string;

    if (!recaptchaToken) {
      return NextResponse.json({
        success: false,
        message: 'form.recaptchaRequired',
      }, { status: 400 });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);

    if (!isHuman) {
      return NextResponse.json({
        success: false,
        message: 'form.recaptchaFail',
      }, { status: 400 });
    }

    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const company = formData.get('company') as string;
    const budget = formData.get('budget') as string;
    const deadline = formData.get('deadline') as string;
    const message = formData.get('message') as string;
    const contactMethod = formData.get('contactMethod') as ContactMethod;
    const contactDetails = formData.get('contactDetails') as string;
    const privacyAccepted = formData.get('privacyAccepted') === 'on';

    if (!name || !surname || !message || !contactMethod || !contactDetails || !privacyAccepted) {
      return NextResponse.json({
        success: false,
        message: 'form.fillRequiredFields',
      }, { status: 400 });
    }

    if (message.length < 30) {
      return NextResponse.json({
        success: false,
        message: 'form.tooShort',
      }, { status: 400 });
    }

    if (message.length > 3000) {
      return NextResponse.json({
        success: false,
        message: 'form.tooLong',
      }, { status: 400 });
    }

    if (deadline && !validateDate(deadline)) {
      return NextResponse.json({
        success: false,
        message: 'form.invalidDeadline',
      }, { status: 400 });
    }

    if (!validateContactDetails(contactMethod, contactDetails)) {
      return NextResponse.json({
        success: false,
        message: `form.invalidContact`,
      }, { status: 400 });
    }

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const text = `
<b>Новая заявка с codewave.pro</b>
━━━━━━━━━━━━━━━━━━

<b>Страна:</b> ${country}
<b>IP:</b> ${ip}

👤 <b>Имя:</b> ${name} ${surname}
🏢 <b>Компания:</b> ${company || 'не указана'}
💰 <b>Бюджет:</b> ${budget || 'не указан'}
⏰ <b>Дедлайн:</b> ${deadline || 'не указан'}

━━━━━━━━━━━━━━━━━━
<b>Сообщение:</b>
${message}

━━━━━━━━━━━━━━━━━━
<b>Предпочтительный способ связи:</b> ${contactMethod}
${contactDetails}

<b>ID заявки:</b> ${orderId}
`;

    try {
      await sendTelegramMessage(text, orderId);

      return NextResponse.json({
        success: true,
        message: 'form.success',
      });
    } catch (error) {
      console.error('Error in sendTelegramMessage:', error);
      
      return NextResponse.json({
        success: false,
        message: 'form.error',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }, { status: 500 });
  }
}
