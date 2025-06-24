import { NextRequest, NextResponse } from 'next/server';
import { getCountry } from '@/lib/ipUtils';

type ContactMethod = 'email' | 'telegram' | 'twitter' | 'discord' | 'linkedin' | 'whatsapp';

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

function validateContactDetails(method: ContactMethod, details: string): boolean {
  if (!details.trim()) return false;

  switch (method) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details);

    case 'telegram':
      return /^@[a-zA-Z0-9_]{5,}$/.test(details) ||
        /^(https?:\/\/)?(t\.me\/)[a-zA-Z0-9_]{5,}$/.test(details);

    case 'twitter':
      return /^@[a-zA-Z0-9_]{1,15}$/.test(details) ||
        /^(https?:\/\/)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/.test(details);

    case 'discord':
      return /^[a-zA-Z0-9_-]{2,32}$/.test(details) ||
        /^(https?:\/\/)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9_-]+$/.test(details);

    case 'linkedin':
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/.test(details);

    case 'whatsapp':
      return /^\+[0-9]{7,15}$/.test(details) ||
        /^(https?:\/\/)?(wa\.me)\/[0-9]{7,15}$/.test(details);

    default:
      return true;
  }
}

function validateDate(dateStr: string): boolean {
  if (!dateStr) return true;

  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return !isNaN(selectedDate.getTime()) && selectedDate >= today;
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
        message: 'reCAPTCHA verification is required',
      }, { status: 400 });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);

    if (!isHuman) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.',
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
        message: 'Please fill in all required fields',
      }, { status: 400 });
    }

    if (message.length < 30) {
      return NextResponse.json({
        success: false,
        message: 'Message is too short. Please provide more details.',
      }, { status: 400 });
    }

    if (message.length > 3000) {
      return NextResponse.json({
        success: false,
        message: 'Message is too long. Please limit your message to 3000 characters.',
      }, { status: 400 });
    }

    if (deadline && !validateDate(deadline)) {
      return NextResponse.json({
        success: false,
        message: 'Deadline cannot be in the past.',
      }, { status: 400 });
    }

    if (!validateContactDetails(contactMethod, contactDetails)) {
      return NextResponse.json({
        success: false,
        message: `Invalid ${contactMethod} contact details`,
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
        message: 'Your message has been sent successfully!',
      });
    } catch (error) {
      console.error('Error in sendTelegramMessage:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Failed to send message. Please try again later.',
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
