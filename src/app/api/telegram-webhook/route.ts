import { NextRequest, NextResponse } from 'next/server';

type TelegramUpdate = {
  update_id: number;
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message: {
      message_id: number;
      chat: {
        id: number;
      };
      text: string;
    };
    data: string;
  };
};

type TelegramResponse = {
  success: boolean;
  message: string;
};

async function updateTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string
): Promise<Response> {

  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('Telegram credentials are not configured');
  }

  const url = `https://api.telegram.org/bot${token}/editMessageText`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
      }),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error updating message:', responseData);
    }
    
    return response;
  } catch (error) {
    console.error('Error in updateTelegramMessage:', error);
    throw error;
  }
}

async function answerCallbackQuery(
  callbackQueryId: string,
  text: string
): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('Telegram credentials are not configured');
    throw new Error('Telegram credentials are not configured');
  }

  const url = `https://api.telegram.org/bot${token}/answerCallbackQuery`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: true,
      }),
    });
    
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error answering callback query:', responseData);
    }
    
    return response;
  } catch (error) {
    console.error('Error in answerCallbackQuery:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<TelegramResponse>> {
  try {

    const update: TelegramUpdate = await request.json();

    if (!update.callback_query) {
      return NextResponse.json({
        success: false,
        message: 'Not a callback query',
      }, { status: 400 });
    }

    const { callback_query } = update;
    const { data, message, id: callbackQueryId } = callback_query;
    const { chat, message_id, text } = message;

    const [action, orderId] = data.split(':');

    if (!action || !orderId) {
      return NextResponse.json({
        success: false,
        message: 'Invalid callback data',
      }, { status: 400 });
    }

    const currentDate = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let updatedText = text;
    let responseText = '';

    if (action === 'accept_order') {
      updatedText = `${text}\n\n✅ <b>Заявка принята:</b> ${currentDate}`;
      responseText = `Заявка ${orderId} успешно принята!`;
    } else if (action === 'reject_order') {
      updatedText = `${text}\n\n❌ <b>Заявка отклонена:</b> ${currentDate}`;
      responseText = `Заявка ${orderId} отклонена.`;
    } else {
      return NextResponse.json({
        success: false,
        message: 'Unknown action',
      }, { status: 400 });
    }

    await answerCallbackQuery(callbackQueryId, responseText);

    const result = await updateTelegramMessage(chat.id, message_id, updatedText);

    if (!result.ok) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update message',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
    });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
