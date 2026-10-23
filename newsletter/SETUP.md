# Activate free email updates

This implementation uses a free Google account, Apps Script, and a private Google Sheet. It does not require a paid newsletter provider, billing account, or paid API.

Readers confirm their address before joining. Signup attempts to send the confirmation email immediately. Confirming attempts to send the owner notification and a welcome message with three essays immediately. Mail is persisted in the queue first; failed or quota-limited sends retry on the hourly trigger. Inbox arrival still depends on the mail provider and spam filtering. The same hourly trigger reads the site's published `updates.json`, queues new or revised content, and emails confirmed subscribers. Every update contains an unsubscribe link.

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
7. Run **setupNewsletter_** once using the temporary editor wrapper below (underscore-suffixed functions are hidden from the editor's Run dropdown). It creates the private subscriber Sheet, records existing content as a baseline (no historical blast), and installs an hourly trigger. Leave the Sheet private. The generated `SPREADSHEET_ID` is saved in Script Properties.
8. In this GitHub repository, Settings → Secrets and variables → Actions → Variables, add **NEWSLETTER_URL** with the `/exec` URL. Redeploy the site. For local preview, set `VITE_NEWSLETTER_URL` in `.env.local`, then restart Vite.
9. Subscribe with an address you control. The confirmation email is sent during signup when quota is available. Open its link and explicitly confirm; the welcome email and owner notification are then sent during confirmation. Check Spam as well as Inbox. If a message is queued because sending failed or quota ran out, wait for the hourly trigger or run **newsletterTick_** using the temporary wrapper technique below. Then test unsubscribe.

The code is prepared, but no account, Google deployment, or mail trigger is activated by merely committing these files.

## Update an existing deployment for immediate signup emails

Replace the Apps Script project's `Code.gs` with this repository's updated `newsletter/Code.gs` and save. Keep your existing Script Properties, subscriber Sheet, and trigger. Remove any temporary editor wrappers before deploying.

Choose **Deploy → Manage deployments**, select the existing web app, click the pencil icon, choose **New version**, and click **Deploy**. Updating the existing deployment retains its `/exec` URL, so `NEWSLETTER_URL` in GitHub does not need to change. Saving source alone does not update the versioned public web app. No setup rerun is needed.

New signups and confirmations attempt immediate delivery after this update. Messages already waiting in the queue will be picked up by the next hourly run, or a manual mail check. Published blog updates still use the hourly check; this change removes the scheduled wait for signup, welcome, and owner-notification emails.

## Run setup from the editor

After deploying the web app and setting `WEB_APP_URL`, temporarily add this at the bottom of `Code.gs`, outside all other functions:

```javascript
function runNewsletterSetup() {
  setupNewsletter_();
}
```

Save, select **runNewsletterSetup** from the dropdown beside Run / Debug, then click **Run**. Review permissions if prompted. The execution log should say **Ready. Existing content was baselined…** and show the subscriber Sheet ID.

Delete the temporary wrapper and save after setup succeeds. **Do not deploy a version containing this wrapper**: functions without a trailing underscore can be invoked by the web client. Your existing versioned `/exec` deployment remains unchanged while you run the temporary editor code. Keep the original `setupNewsletter_` function and its underscore intact.

For a manual mail check in step 9, use the same technique with a temporary `runNewsletterCheck` function that calls `newsletterTick_()`. Running it processes the real queue and can send emails. Remove that wrapper and save before any deployment as well. The installed hourly trigger calls `newsletterTick_` directly and needs no wrapper.

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
