# Five-minute recording plan

Record the real web app and installed Android app, using the same fictional
reviewer account. Keep notifications, credentials, environment files, terminals
with tokens, and personal information out of the recording. This is a script;
no completed recording exists yet.

| Time      | Action                                                  | Evidence                                     |
| --------- | ------------------------------------------------------- | -------------------------------------------- |
| 0:00–0:35 | Introduce TaskFlow and log in on web and Android        | Same account; both clients work              |
| 0:35–1:15 | Show dashboard and a project                            | Five counts and project details              |
| 1:15–2:05 | Create a named task on web with priority/due date       | Saved task and form validation               |
| 2:05–2:40 | Pull to refresh Android and find that task              | Shared API/database synchronization          |
| 2:40–3:15 | Edit/complete the task on Android, refresh web          | Reverse synchronization                      |
| 3:15–3:50 | Demonstrate search, status and priority filters         | Filtered list and empty state                |
| 3:50–4:20 | Enable airplane mode, show message, reconnect and retry | Offline handling without crash               |
| 4:20–4:45 | Show a tested foreign resource returning 404 and logout | Ownership and session boundary               |
| 4:45–5:00 | Show repository, API docs and ER diagram                | Explain one backend/Postgres and SecureStore |

Use a separate fictional account for the foreign-resource demonstration; do not
expose real accounts or paste access tokens into a browser address bar. Prepare
the example before recording. Show token expiry only if it is safely reproducible
without changing production expiry or weakening rate limits.

Before sharing, replay the recording, check readable UI/audio, verify the link
opens without reviewer login, and add its real URL to SUBMISSION.md and README.
