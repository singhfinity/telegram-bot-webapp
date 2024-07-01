import TelegramBot from 'node-telegram-bot-api';

export class TelegramBotService {
    private bot: TelegramBot;

    constructor(botToken: string) {
        this.bot = new TelegramBot(botToken, { polling: true });
    }

    public setupCommands(): void {
        this.bot.onText(/\/start/, this.handleStart.bind(this));
        this.bot.onText(/\/adminhello (\d+) (.+)/, this.handleAdminHello.bind(this));
    }

    private async handleStart(msg: TelegramBot.Message): Promise<void> {
        const chatId = msg.chat.id;
        const firstName = msg.from!.first_name;

        const webAppUrl = process.env.WEBAPP_URL;
        if (!webAppUrl) {
            console.error('WEBAPP_URL is not set in environment variables');
            return;
        }

        const signUpUrl = `${webAppUrl}?id=${chatId}&name=${encodeURIComponent(firstName)}`;

        this.bot.sendMessage(chatId, `Hello${firstName && ' ' + firstName}!`, {
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Open App', web_app: { url: signUpUrl } }
                ]]
            }
        });
    }

    private async handleAdminHello(msg: TelegramBot.Message, match: RegExpExecArray | null): Promise<void> {
        const adminId = msg.from!.id.toString();
        const adminIds = process.env.ADMIN_IDS!.split(',');

        if (!this.isAdmin(adminId, adminIds)) {
            this.bot.sendMessage(msg.chat.id, 'You are not authorized to use this command.');
            return;
        }

        const targetUserId = match![1];
        const message = match![2];

        await this.sendMessageToUser(targetUserId, message);
    }

    private isAdmin(userId: string, adminIds: string[]): boolean {
        return adminIds.includes(userId);
    }

    private async sendMessageToUser(userId: string, message: string): Promise<void> {
        try {
            await this.bot.sendMessage(userId, message);
            this.bot.sendMessage(userId, `Message sent to user ${userId}`);
        } catch (error) {
            this.bot.sendMessage(userId, `Error sending message to user ${userId}: ${(error as Error).message}`);
        }
    }
}