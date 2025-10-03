import { NMTypes } from "./types";
import { NMHelpers } from "./helpers";

export const NM = new Proxy<NMTypes.Client>({} as NMTypes.Client, {
	get(_, key) {
		if (typeof key === "symbol") {
			throw new Error("Cannot get a symbol key");
		}
		return async (request: unknown, options?: NMTypes.Options) => {
			const config = NMHelpers.getConfig(options);
			const auth = `Basic ${config.username}:${config.password}`;
			const body = JSON.stringify(objectFromCamelCaseToKebabCase(request));

			const response = await fetch(`${config.baseUrl}/${key}`, {
				method: "POST",
				body,
				headers: {
					"Content-Type": "application/json",
					Authorization: auth,
				},
			}).then((response) => response.json());

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
