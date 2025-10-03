export namespace NMTypes {
	export type Client = {
		/**
		 * Запрос используется для отправки сообщений по различным каналам.
		 */
		send(request: SendRequest, options?: Options): Promise<void>;
		/**
		 * Запрос используется для запроса статусов отправленных сообщений. Статус сообщения доступен не сразу, а только спустя несколько минут после отправки.
		 */
		getStatus(
			request: GetStatusRequest,
			options?: Options,
		): Promise<GetStatusResponse>;
	};

	export type Options = {};

	export type SendRequest = {
		/**
		 * Идентификатор шаблона для отправки сообщения
		 */
		templateId?: string;
		/**
		 * Приоритет (указывается в цифровой форме):
		 * 2 - low - низкий,
		 * 4 - normal - обычный,
		 * 6 - high - высокий,
		 * 8 - realtime - наивысший.
		 */
		priority?: 2 | 4 | 6 | 8;
		/**
		 * Идентификатор черного списка
		 */
		blacklistId?: string;
		/**
		 * Дополнительный параметр, как правило не учитывается
		 */
		externalId1?: string;
		/**
		 * Дополнительный параметр, как правило не учитывается
		 */
		externalId2?: string;
		/**
		 * Дополнительный параметр, как правило не учитывается
		 */
		externalId3?: string;
		/**
		 * Временные настройки
		 */
		timing?: SendTiming;
		viber?: SendAny;
		sms?: SendAny;
		push?: SendAny;
		call?: SendCall;
		/**
		 * Параметры получателей
		 */
		messages: SendMessages[];
	};

	export type SendTiming = {
		/**
		 * Отправлять по местному времени
		 * 0 - получателя
		 * 1 - системы
		 */
		localtime: 0 | 1;
		/**
		 * Дата начала отправки. Если не указана, то сообщения отправляются сразу же
		 */
		startDatetime?: Date;
		/**
		 * Дата завершения отправки. Если не указана, то система не стремится отправиться все сообщения до определенного времени.
		 */
		endDatetime?: Date;
		/**
		 * Время, с которого разрешена отправка
		 */
		allowedStarttime: `${number}:${number}`;
		/**
		 * Время, до которого разрешена отправка.
		 */
		allowedEndtime: `${number}:${number}`;
		/**
		 * Равномерно распределять отправку
		 * 1 - распределять
		 * 0 - не распределять
		 */
		sendEvenly: 0 | 1;
	};

	export type SendAny = {
		/**
		 * Адрес отправителя Не используется для канала Push Для канала Email адрес может быть указан следующим образом: <имя> адрес
		 */
		originator?: string;
		/**
		 * Название приложения, куда будет отправлено уведомление Используется только для канала Push
		 */
		application?: string;
		/**
		 * Время жизни сообщения в секундах. По истечении данного времени сообщению присваивается статус expired и производится отправка сообщения по альтернативному каналу, если он задан
		 */
		ttl?: number;
		content?:
		| SendViberContent
		| SendSmsContent
		| SendPushContent
		| SendEmailContent
		| SendUssdContent;
	};

	export type SendViberContent = {
		/**
		 * Текст сообщения, максимальная длина 1000 символов
		 */
		text?: string;
		/**
		 * Ссылка на картинку
		 */
		imageUrl?: string;
		/**
		 * Название кнопки
		 */
		buttonName?: string;
		/**
		 * Ссылка для перехода по кнопке
		 */
		buttonUrl?: string;
	};

	export type SendSmsContent = {
		/**
		 * Текст сообщения, максимальная длина 70 символов кириллицей, 160 символов латиницей. Если длина сообщения больше указанных, то сообщение разбивается (при формировании user-сообщения) на несколько частей, каждая часть тарифицируется отдельно.
		 */
		text?: string;
	};

	export type SendPushContent = {
		/**
		 * Заголовок сообщения
		 */
		title?: string;
		/**
		 * Текст сообщения, максимальная длина 1000 символов
		 */
		text?: string;
		/**
		 * Дополнительный контент (строковый)
		 */
		extraContent?: string;
		/**
		 * Объект для передачи пользовательский параметров в виде пар ключ:значение, разделенных запятой. Значение должно иметь строковй тип.
		 */
		additionalData?: object;
	};

	export type SendEmailContent = {
		/**
		 * Тема письма
		 */
		subject?: string;
		/**
		 * Текст письма
		 */
		text?: string;
		/**
		 * Ассоциативный массив ссылок на прикрепленные файлы. Формат: Имя файла: файл в base64
		 */
		attachedFiles?: Record<string, string>[];
	};

	export type SendUssdContent = {
		/**
		 * Текст сообщения
		 */
		text?: string;
		/**
		 * Название USSD-меню
		 */
		menu?: string;
	};

	export type SendCall = {
		/**
		 * Текст сообщения для синтеза TTS, до 2000 байт (1000 символов). Используется один из трех параметров: text, file, ivrmenu. Запрос с с более чем одним параметром считается некорректным.
		 */
		text?: string;
		/**
		 * Название аудиофайла. Используется один из трех параметров: text, file, ivrmenu. Запрос с с более чем одним параметром считается некорректным.
		 */
		file?: "text" | "file" | "ivrmenu";
		/**
		 * Название IVR-меню. Используется один из трех параметров: text, file, ivrmenu. Запрос с с более чем одним параметром считается некорректным.
		 */
		menu?: "text" | "file" | "ivrmenu";
		/**
		 * Количество попыток повторного звонка. Допустимы только неотрицательные числа.
		 */
		retryAttempts?: number;
		/**
		 * Интервал, через который будет произведен повторный звонок, в миллисекундах
		 */
		retryTimeout?: number;
	};

	export type SendMessages = {
		/**
		 * Адрес получателя (как правило MSISDN). Обязателен, если отправка идет по транспорту отличному Email, или по шаблону отличному от Email.
		 */
		recipient?: string;
		/**
		 * Email-адрес получателя. Обязателен, если отправка идет по транспорту Email, или по шаблону Email.
		 */
		emailAddress?: string;
		/**
		 * Уникальный идентификатор сообщения для отправителя сообщения. Максимальная длина 30 символов.
		 */
		messageId: string;
		/**
		 * Идентификатор шаблона для отправки сообщения
		 */
		templateId?: string;
		/**
		 * Приоритет:
		 * low - низкий,
		 * normal - обычный,
		 * high - высокий,
		 * realtime - наивысший.
		 * Если не указан, то используется normal
		 */
		priority?: "low" | "normal" | "high" | "realtime";
		/**
		 * Временные настройки
		 */
		timing?: SendTiming;
		/**
		 * Объект параметров и их значений для подстановки в сообщение (каждый элемент представлен как запись ПАРАМЕТР:ЗНАЧЕНИЕ, например, {"PARAM1":"VALUE1" , "PARAM2":"VALUE2"}).
		 */
		variables?: object[];
		viber?: SendAny;
		sms?: SendAny;
		push?: SendAny;
		call?: SendCall;
		email?: SendAny;
		ussd?: SendAny;
	};

	export type GetStatusRequest = {
		messageId: string[];
	};

	export type GetStatusResponse = {
		messages: GetStatusMessage[];
	};

	export type GetStatusMessage = {
		/**
		 * Идентификатор сообщения
		 */
		messageId: string;
		/**
		 * Канал, по-которому было доставлено сообщение
		 */
		channel?: string;
		/**
		 * Статус сообщения:
		 * 	Transmitted - Отправлено
		 * 	Delivered - Доставлено
		 * 	NotDelivered - Не доставлено
		 * 	Failed - Ошибка при отправке
		 * 	Rejected - Отклонено системой
		 * 	Read - Прочитано (только для Viber и Push)
		 * 	Deferred - отправка сообщения отложена
		 * 	Buffered - отправка сообщения отложена (только для Call)
		 */
		status?:
		| "Transmitted"
		| "Delivered"
		| "NotDelivered"
		| "Failed"
		| "Rejected"
		| "Read"
		| "Deferred"
		| "Buffered";

		/**
		 * Дата и время получения статуса
		 */
		statusDate?: string;
		/**
		 * Описание причины недоставки сообщения, ошибки, либо "Информация отсутствует"
		 */
		description?: string;
	};
}
