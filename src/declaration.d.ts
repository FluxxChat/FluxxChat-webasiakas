/* FluxxChat-webasiakas
 * Copyright (C) 2019 Helsingin yliopisto
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

declare module '*.scss' {
	const content: {[className: string]: string};
	export default content;
}

declare interface MediaRecorderErrorEvent extends Event {name: string;}

declare interface MediaRecorderDataAvailableEvent extends Event {data : any;}

interface MediaRecorderEventMap {
	'dataavailable': MediaRecorderDataAvailableEvent;
	'error': MediaRecorderErrorEvent ;
	'pause': Event;
	'resume': Event;
	'start': Event;
	'stop': Event;
	'warning': MediaRecorderErrorEvent ;
}

declare class MediaRecorder extends EventTarget {
	readonly mimeType: string;
	// readonly MimeType: 'audio/wav';
	readonly state: 'inactive' | 'recording' | 'paused';
	readonly stream: MediaStream;
	ignoreMutedMedia: boolean;
	videoBitsPerSecond: number;
	audioBitsPerSecond: number;
	ondataavailable: (event : MediaRecorderDataAvailableEvent) => void;
	onerror: (event: MediaRecorderErrorEvent) => void;
	onpause: () => void;
	onresume: () => void;
	onstart: () => void;
	onstop: () => void;
	constructor(stream: MediaStream);
	start();
	stop();
	resume();
	pause();
	isTypeSupported(type: string): boolean;
	requestData();
	addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}