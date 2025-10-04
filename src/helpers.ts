import { NMTypes } from "./types";

export namespace NMHelpers {
	function isLatin(char: string) {
		return /[\u0000-\u007F\u00A0-\u024F]+/.exec(char) !== null;
	}

	export function getSmsChunkCount(text: string) {
		const { type, characters } = getCharacterCount(text);
		const limit = type === "latin" ? 160 : 70;
		const concatLimit = type === "latin" ? 153 : 67;

		if (characters <= limit) {
			return 1;
		}

		return Math.ceil(characters / concatLimit);
	}

	export function getCharacterCount(text: string) {
		const { latin, unicode } = text.split("").reduce(
			(acc, char) => {
				if (isLatin(char)) {
					return {
						latin: acc.latin + 1,
						unicode: acc.unicode,
					};
				} else {
					return {
						latin: acc.latin,
						unicode: acc.unicode + 1,
					};
				}
			},
			{ latin: 0, unicode: 0 },
		);

		if (unicode === 0) {
			return {
				type: "latin",
				characters: latin,
			} as const;
		} else {
			return {
				type: "unicode",
				characters: latin + unicode,
			} as const;
		}
	}

	export function getConfig(options?: NMTypes.Options) {
		const defaultUrl = "https://sendsms.nikita.am/broker-api/send"
		return {
			baseUrl: options?.baseUrl ?? process.env.NIKITA_MOBILE_BASE_URL! ?? defaultUrl,
			username: options?.username ?? process.env.NIKITA_MOBILE_USERNAME!,
			password: options?.password ?? process.env.NIKITA_MOBILE_PASSWORD!,
			logging: options?.logging ?? Boolean(process.env.NIKITA_MOBILE_LOGGING)
		};
	}
}
