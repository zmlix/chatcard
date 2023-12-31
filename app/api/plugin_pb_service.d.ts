// package: 
// file: plugin.proto

import * as plugin_pb from "./plugin_pb";
import {grpc} from "@improbable-eng/grpc-web";

type PluginServiceConnect = {
  readonly methodName: string;
  readonly service: typeof PluginService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof plugin_pb.ConnectRequest;
  readonly responseType: typeof plugin_pb.ConnectResponse;
};

type PluginServiceCall = {
  readonly methodName: string;
  readonly service: typeof PluginService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof plugin_pb.CallRequest;
  readonly responseType: typeof plugin_pb.CallResponse;
};

type PluginServiceDirectory = {
  readonly methodName: string;
  readonly service: typeof PluginService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof plugin_pb.DirectoryRequest;
  readonly responseType: typeof plugin_pb.DirectoryResponse;
};

export class PluginService {
  static readonly serviceName: string;
  static readonly Connect: PluginServiceConnect;
  static readonly Call: PluginServiceCall;
  static readonly Directory: PluginServiceDirectory;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class PluginServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  connect(
    requestMessage: plugin_pb.ConnectRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: plugin_pb.ConnectResponse|null) => void
  ): UnaryResponse;
  connect(
    requestMessage: plugin_pb.ConnectRequest,
    callback: (error: ServiceError|null, responseMessage: plugin_pb.ConnectResponse|null) => void
  ): UnaryResponse;
  call(requestMessage: plugin_pb.CallRequest, metadata?: grpc.Metadata): ResponseStream<plugin_pb.CallResponse>;
  directory(
    requestMessage: plugin_pb.DirectoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: plugin_pb.DirectoryResponse|null) => void
  ): UnaryResponse;
  directory(
    requestMessage: plugin_pb.DirectoryRequest,
    callback: (error: ServiceError|null, responseMessage: plugin_pb.DirectoryResponse|null) => void
  ): UnaryResponse;
}

