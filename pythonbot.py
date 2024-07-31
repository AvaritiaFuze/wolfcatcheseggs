from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext
import secrets

async def start(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    token = secrets.token_urlsafe(16)
    save_token(user_id, token)
    
    keyboard = [
        [InlineKeyboardButton("Играть в Волк ловит яйца", web_app=WebAppInfo(url=f"https://your-app-name.vercel.app?token={token}"))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Добро пожаловать в игру Волк ловит яйца! Нажмите кнопку ниже, чтобы начать играть.", reply_markup=reply_markup)

def save_token(user_id, token):
    with open('tokens.txt', 'a') as f:
        f.write(f"{user_id},{token}\n")

def main():
    application = Application.builder().token("7201490127:AAF-uDZw0kLYVgrPnViyq9Zy_mrYNyri9C4").build()
    
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == '__main__':
    main()