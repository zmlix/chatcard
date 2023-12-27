// package: 
// file: plugin.proto

import * as jspb from "google-protobuf";

export class CallRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getCall(): string;
  setCall(value: string): void;

  hasArguments(): boolean;
  clearArguments(): void;
  getArguments(): string;
  setArguments(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  hasOptions(): boolean;
  clearOptions(): void;
  getOptions(): string;
  setOptions(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CallRequest): CallRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallRequest;
  static deserializeBinaryFromReader(message: CallRequest, reader: jspb.BinaryReader): CallRequest;
}

export namespace CallRequest {
  export type AsObject = {
    name: string,
    call: string,
    arguments: string,
    token: string,
    options: string,
  }
}

export class CallResponse extends jspb.Message {
  getStatus(): StatusMap[keyof StatusMap];
  setStatus(value: StatusMap[keyof StatusMap]): void;

  getResponse(): string;
  setResponse(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CallResponse): CallResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallResponse;
  static deserializeBinaryFromReader(message: CallResponse, reader: jspb.BinaryReader): CallResponse;
}

export namespace CallResponse {
  export type AsObject = {
    status: StatusMap[keyof StatusMap],
    response: string,
  }
}

export class PluginOption extends jspb.Message {
  getType(): PluginOptionValueTypeMap[keyof PluginOptionValueTypeMap];
  setType(value: PluginOptionValueTypeMap[keyof PluginOptionValueTypeMap]): void;

  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PluginOption.AsObject;
  static toObject(includeInstance: boolean, msg: PluginOption): PluginOption.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PluginOption, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PluginOption;
  static deserializeBinaryFromReader(message: PluginOption, reader: jspb.BinaryReader): PluginOption;
}

export namespace PluginOption {
  export type AsObject = {
    type: PluginOptionValueTypeMap[keyof PluginOptionValueTypeMap],
    key: string,
    value: string,
  }
}

export class Plugin extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasDisplay(): boolean;
  clearDisplay(): void;
  getDisplay(): string;
  setDisplay(value: string): void;

  hasImg(): boolean;
  clearImg(): void;
  getImg(): string;
  setImg(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  hasInfo(): boolean;
  clearInfo(): void;
  getInfo(): string;
  setInfo(value: string): void;

  clearOptionsList(): void;
  getOptionsList(): Array<PluginOption>;
  setOptionsList(value: Array<PluginOption>): void;
  addOptions(value?: PluginOption, index?: number): PluginOption;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Plugin.AsObject;
  static toObject(includeInstance: boolean, msg: Plugin): Plugin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Plugin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Plugin;
  static deserializeBinaryFromReader(message: Plugin, reader: jspb.BinaryReader): Plugin;
}

export namespace Plugin {
  export type AsObject = {
    name: string,
    display: string,
    img: string,
    version: string,
    info: string,
    optionsList: Array<PluginOption.AsObject>,
  }
}

export class ConnectRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectRequest): ConnectRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConnectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectRequest;
  static deserializeBinaryFromReader(message: ConnectRequest, reader: jspb.BinaryReader): ConnectRequest;
}

export namespace ConnectRequest {
  export type AsObject = {
  }
}

export class ConnectResponse extends jspb.Message {
  getStatus(): StatusMap[keyof StatusMap];
  setStatus(value: StatusMap[keyof StatusMap]): void;

  clearPluginsList(): void;
  getPluginsList(): Array<Plugin>;
  setPluginsList(value: Array<Plugin>): void;
  addPlugins(value?: Plugin, index?: number): Plugin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectResponse): ConnectResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConnectResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectResponse;
  static deserializeBinaryFromReader(message: ConnectResponse, reader: jspb.BinaryReader): ConnectResponse;
}

export namespace ConnectResponse {
  export type AsObject = {
    status: StatusMap[keyof StatusMap],
    pluginsList: Array<Plugin.AsObject>,
  }
}

export interface StatusMap {
  SUCCESS: 0;
  FAILED: 1;
  PROCESS: 2;
}

export const Status: StatusMap;

export interface PluginOptionValueTypeMap {
  STRING: 0;
  NUMBER: 1;
  BOOL: 2;
}

export const PluginOptionValueType: PluginOptionValueTypeMap;

