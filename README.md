# Third-party NikitaMobile SDK

> This package defines types and helpers to be used for NikitaMobile API

# Environment

| environment variable | provided by |
| -------------------- | ----------- |
|                      |             |

> Use `NIKITA_MOBILE_BASE_URL` environment variable to change the base URL of the requests
> By default it is []

# Examples

> Sending sms

```ts
import { NM } from "nikitamobile"

const messageId = crypto.randomUUID()
await NM.send({
    messages: [
        {
            recipient: "37499454545",
            messageId,
            sms: {
                originator: "Acme",
                ttl: 300,
                content: {
                    text: "Welcome!"
                }
            }
        }
    ]
})
```

# Contributing

We wrote the types according to the documentation, however, it may have some mismatches.
If you find any, were are happy to merge PRs.
