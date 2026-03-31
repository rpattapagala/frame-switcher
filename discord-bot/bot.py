import os
from datetime import datetime, timezone

import discord
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_BOT_TOKEN")
TARGET_CHANNEL_ID = int(os.getenv("TARGET_CHANNEL_ID", "0"))
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "voice_chat_log.txt")

if not TOKEN:
    raise RuntimeError("Missing DISCORD_BOT_TOKEN in .env")
if TARGET_CHANNEL_ID == 0:
    raise RuntimeError("Missing TARGET_CHANNEL_ID in .env")

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True  # Required to read normal message content

client = discord.Client(intents=intents)


def append_line(line: str) -> None:
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")
        f.flush()


@client.event
async def on_ready():
    print(f"Logged in as {client.user} (ID: {client.user.id})")
    print(f"Watching channel ID: {TARGET_CHANNEL_ID}")
    print(f"Writing to: {OUTPUT_FILE}")

    channel = client.get_channel(TARGET_CHANNEL_ID)
    if channel is None:
        print("Warning: channel not found in cache yet. Check that the bot is in the server and can see the channel.")
    else:
        print(f"Found channel: {channel.name} ({channel.id})")


@client.event
async def on_message(message: discord.Message):
    # Ignore the bot's own messages
    if message.author == client.user:
        return

    # Only log the target channel
    if message.channel.id != TARGET_CHANNEL_ID:
        return

    timestamp = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")
    author = f"{message.author} ({message.author.id})"
    content = message.content.replace("\n", "\\n").strip()

    if not content and message.attachments:
        content = f"[attachments only: {', '.join(a.filename for a in message.attachments)}]"
    elif not content:
        content = "[no text content]"

    line = f"[{timestamp}] {author}: {content}"
    append_line(line)
    print(line)


client.run(TOKEN)