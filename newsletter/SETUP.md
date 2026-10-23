# Activate free email updates

This implementation uses a free Google account, Apps Script, and a private Google Sheet. It does not require a paid newsletter provider, billing account, or paid API.

Readers confirm their address before joining. The owner receives an email after each confirmed subscription. New subscribers receive a welcome message with three essays. An hourly trigger reads the site's published `updates.json`, queues new or revised content, and emails confirmed subscribers. Every update contains an unsubscribe link.

## One-time activation

1. Deploy the website changes to GitHub Pages first. Check that `https://alokmikmishra6.github.io/agentic-ai-powertools/updates.json` returns JSON.
2. Sign in to the Google account that will send the emails, open https://script.google.com, and create a new project.
3. Paste `Code.gs` into the project's Code file. Create an HTML file named **Signup** and paste `Signup.html`. In Project Settings, enable the manifest file and replace its contents with `appsscript.json`.
4. In Project Settings → Script Properties, add:
   - `OWNER_EMAIL`: the address that should receive new-subscriber notifications.
   - `SITE_URL`: `https://alokmikmishra6.github.io/agentic-ai-powertools`

   Your notification address is already filled in `newsletter/settings.local.json` in this checkout. That file is gitignored; copy its values into Script Properties. It is a setup reference and is not read automatically by Apps Script.

5. Choose Deploy → New deployment → Web app. Execute as **yourself**; allow access to **Anyone**. Authorize your own script. If your organization's Google account forbids anonymous web apps, use a personal Google account.
6. Copy the deployment URL ending in `/exec`. Add it as the Script Property `WEB_APP_URL`.
7. Run **setupNewsletter_** once from the editor. It creates the private subscriber Sheet, records existing content as a baseline (no historical blast), and installs an hourly trigger. Leave the Sheet private. The generated `SPREADSHEET_ID` is saved in Script Properties.
8. In this GitHub repository, Settings → Secrets and variables → Actions → Variables, add **NEWSLETTER_URL** with the `/exec` URL. Redeploy the site. For local preview, set `VITE_NEWSLETTER_URL` in `.env.local`, then restart Vite.
9. Subscribe with an address you control. Wait for the hourly trigger, or run **newsletterTick_** manually. Open the confirmation link and explicitly confirm. Run the trigger again to check the welcome email and owner notification. Then test unsubscribe.

The code is prepared, but no account, Google deployment, or mail trigger is activated by merely committing these files.

## Free sending limits

Google currently documents 100 recipients/day for consumer Apps Script accounts; other scripts on the same account may share the quota. This code checks `MailApp.getRemainingDailyQuota()` before sending, reserves five recipients, and sends at most 25 queued messages per trigger. It does not buy additional quota. Delayed updates remain in the Sheet's Queue tab. Confirmation links expire after 24 hours; expired confirmations are cancelled and readers can request a fresh link.

Signup requests are capped at 20/day with a one-hour cooldown per address and a honeypot field. The cap protects the free quota; adjust it only with the sending budget in mind. An open public signup form can still be abused, so inspect the Queue tab if legitimate confirmations stop arriving.

At approximately 90+ active subscribers, even a single update may need more than a day to deliver. Owner notices, confirmation messages, and welcome messages also consume recipient quota. Google can change quotas. If reliable high-volume delivery becomes necessary, keep RSS available and reassess rather than adding billing automatically.

## Operating the list

- `Subscribers`: pending, confirmed, or unsubscribed status. Only confirmed subscribers receive updates.
- `Queue`: queued, sent, cancelled, or failed. After five failed attempts, inspect the account's quota and authorization before changing a failed row back to queued.
- `Published`: content IDs and revisions already processed. The same revision is not deliberately sent twice. A rare interruption after Google accepts a message but before its sent status is saved can cause a duplicate on retry.
- To pause mailing, disable the `newsletterTick_` trigger in Apps Script. Do not delete Published unless you intend to re-baseline.
- Keep private list access restricted. Delete a person's rows from Subscribers and Queue if you need to remove their stored address.
- Public signup functions never return the subscriber list. Setup and trigger functions end in `_` so the web client cannot call them through `google.script.run`.
- The previous Beehiiv Worker and Buttondown workflow are retired; do not activate them alongside this sender.

References: https://developers.google.com/apps-script/guides/services/quotas, https://developers.google.com/apps-script/reference/mail/mail-app, https://developers.google.com/apps-script/guides/web
