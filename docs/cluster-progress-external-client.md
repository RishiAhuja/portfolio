# External cluster progress clients

The authenticated receiver is:

```text
POST https://rishia.in/api/cluster-progress/ingest
Authorization: Bearer <CLUSTER_PROGRESS_TOKEN>
Content-Type: application/json
```

Set `CLUSTER_PROGRESS_TOKEN` in the deployed portfolio environment. Give the
same value to a cluster operator only through a private channel and store it in
a mode-600 environment file. Never commit it or print it in job logs.

Clients should send compact status only. Do not send prompts, generated model
answers, raw JSONL, metrics contents, model weights, credentials, or scheduler
logs. A representative payload is:

```json
{
  "campaign": "pair-ctrl-external-top10-20260811",
  "source": "friend-cluster",
  "host": "gpu-host",
  "generated_at": "2026-08-11T10:30:00Z",
  "done": 32000,
  "total": 124000,
  "percent": 25.806,
  "running": 1,
  "held": 0,
  "queued": 7,
  "eta_label": null,
  "eta_note": "Sequential single-GPU campaign",
  "progress_text": "Compact per-job row counts only"
}
```

`campaign` is normalized to lowercase and may contain letters, numbers, dots,
underscores, and hyphens. Omitting it preserves the historical `caisc` stream.
Each campaign is stored separately, preventing external updates from replacing
the original cluster's latest snapshot.

Authenticated readers can select a stream with:

```text
GET /api/cluster-progress/latest?campaign=pair-ctrl-external-top10-20260811
```

Before distributing a client, test its dry-run payload locally and confirm that
no output content or token appears. Then send one authenticated POST and verify
the selected campaign through the admin-only latest endpoint.
