import { NMTypes } from "./types";
import { NMHelpers } from "./helpers";

export const NM = new Proxy<NMTypes.Client>({} as NMTypes.Client, {
	get(_, key) {
		if (typeof key === "symbol") {
			throw new Error("Cannot get a symbol key");
		}
		return async (request: unknown, options?: NMTypes.Options) => {
			const config = NMHelpers.getConfig(options);
			const basicAuth = btoa(`${config.username}:${config.password}`)

			const auth = `Basic ${basicAuth}`;
			const body = JSON.stringify(objectFromCamelCaseToKebabCase(request));

			if (config.logging) {
				console.debug("NM:path", key)
				console.debug("NM:body", body)
			}
			const response = await fetch(`${config.baseUrl}/${key}`, {
				method: "POST",
				body,
				headers: {
					"Content-Type": "application/json",
					Authorization: auth,
				},
			}).then(async (response) => {
				if (!response.ok) {
					if (config.logging) {
						console.error("NM:status", response.status)
					}
					throw new Error(await response.text().catch((e) => e));
				}
				const content = await response.text()
				console.debug("NM:response", content)
				return JSON.parse(content)
			});

			return objectFromKebabCaseToCamelCase(response);
		};
	},
});

function camelCaseToKebabCase(key: string) {
	key
		.split("")
		.map((c) => {
			const isUpperCase = c.toLocaleUpperCase() === c;
			if (isUpperCase) {
				return "-" + c;
			} else {
				return c;
			}
		})
		.join("");
}

function kebabCaseToCamelCase(key: string) {
	key
		.split("-")
		.map((k, i) => {
			if (!k) {
				return k;
			}

			if (i === 0) {
				return k;
			}

			return k[0].toLocaleUpperCase() + k.slice(1);
		})
		.join("");
}

function objectFromCamelCaseToKebabCase(obj: unknown) {
	if (Array.isArray(obj)) {
		return obj.map(objectFromCamelCaseToKebabCase);
	}

	if (typeof obj === "object" && obj) {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => {
				const k = camelCaseToKebabCase(key);
				const v = objectFromCamelCaseToKebabCase(value);
				return [k, v];
			}),
		);
	}

	return obj;
}

function objectFromKebabCaseToCamelCase(obj: unknown) {
	if (Array.isArray(obj)) {
		return obj.map(objectFromKebabCaseToCamelCase);
	}

	if (typeof obj === "object" && obj) {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => {
				const k = kebabCaseToCamelCase(key);
				const v = objectFromKebabCaseToCamelCase(value);
				return [k, v];
			}),
		);
	}

	return obj;
}
