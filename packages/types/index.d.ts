type XIMIRole = "PERFORMER" | "SCOUT" | "CONTROL" | "OUTPUT";

type PresetIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type ParticipantIdentity = string;

type VideoLayout = {} | null;

interface RoomAction {
  roomName: string;
}

interface SwitchActivePresetAction extends RoomAction {
  type: "set-active-preset";
  activePreset: PresetIndex;
}

interface SetPresetNameAction extends RoomAction {
  type: "set-preset-name";
  preset: PresetIndex;
  name: string;
}

interface MuteAudioAction extends RoomAction {
  type: "mute-audio";
  channel: string;
  forParticipant: string;
}

interface UnmuteAudioAction extends RoomAction {
  type: "unmute-audio";
  channel: string;
  forParticipant: string;
}

interface SetAudioDelayAction extends RoomAction {
  type: "set-audio-delay";
  forParticipant: string;
  delay: number;
}

interface XimiRoomState {
  passcode: string;
  activePreset: SwitchActivePresetAction["activePreset"];
  presets: Preset[];
}

interface XimiParticipantState {
  role: XIMIRole;
  audio: { mute: ParticipantIdentity[]; delay: number };
  video: { layout: VideoLayout };
}

interface Preset {
  name: string;
  participants: Record<
    string,
    { identity: string; state: XimiParticipantState }
  >;
}

interface MessageDataPayload {
  type: "message";
  from: string;
  message: string;
}

interface PingDataPayload {
  type: "ping";
  id: number;
  sender: string;
}

interface PongDataPayload {
  type: "pong";
  id: number;
}

MessageDataPayload | PingDataPayload | PongPayload;

export {
  XIMIRole,
  PresetIndex,
  SwitchActivePresetAction,
  SetPresetNameAction,
  MuteAudioAction,
  UnmuteAudioAction,
  SetAudioDelayAction,
  XimiRoomState,
  XimiParticipantState,
  MessageDataPayload,
  PingDataPayload,
  PongDataPayload,
};
