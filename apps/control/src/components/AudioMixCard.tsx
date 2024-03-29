import { PingPayload, ServerUpdate } from "@thegoodwork/ximi-types/src/room";
import {
  ConnectionState,
  DataPacket_Kind,
  Participant,
  RemoteParticipant,
  Room,
  RoomEvent,
} from "livekit-client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  HourglassOutline,
  LinkOutline,
  MicSharp,
  PersonCircle,
  SwapHorizontal,
  VideocamSharp,
  VolumeHighSharp,
  VolumeMuteSharp,
  GitCommitOutline,
  ArrowForward,
  Telescope,
  DesktopOutline,
} from "react-ionicons";
import Button from "ui/Buttons/Button";
import { useToast } from "ui/Feedback/Toast";
import Input from "ui/Form/Input";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";

const StyledDiv = styled("div", {
  variants: {
    type: {
      CONTROL: { border: "3px solid $accent" },
      SCOUT: { border: "1px solid $accent" },
      PERFORMER: {
        border: "1px solid $brand",
      },
    },
  },
  display: "flex",
  height: "100%",
  width: "100%",
  minHeight: "240px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  padding: "$sm",
  borderRadius: "$xs",

  backgroundColor: "$background",
  color: "$text",
  gap: "$sm",

  "> div": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "center",
    gap: "$sm",
  },

  ".footer": {
    width: "100%",
    position: "relative",
    borderTop: "1px solid $text",
    boxSizing: "border-box",
    padding: "$xs 0",
    paddingBottom: "0",
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr",
    gridGap: "$sm",

    ".footer-box": {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "start",
      boxSizing: "borderBox",
    },

    ".spacer": {
      width: "100%",
      height: "100%",
      borderRight: "1px solid $text",
    },

    ".stream-link": {
      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        borderBottom: "none",
        paddingBottom: "$xs",
      },
      ".buttons": {
        display: "flex",
        gap: "$xs",
        width: "100%",
        height: "100%",

        "input.hidden": {
          position: "absolute",
          top: "-100000px",
        },
      },
    },
    ".audio-delay": {
      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        paddingBottom: "$xs",
        borderBottom: "none",
        "path:last-child": {
          fill: "$text",
        },
      },
      ".inputs": {
        display: "flex",
        flexDirection: "row",
        gap: "$xs",
        height: "100%",

        ".delay-display": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "$2xs",
          padding: "0 $2xs",
          width: "40%",
          color: "$text",
          fontWeight: "$normal",
          fontSize: "$2xs",
          border: "1px solid $brand",
        },

        ".input-group": {
          width: "100%",
          display: "flex",
          gap: 0,
          flexDirection: "row",
        },
      },
    },
  },
  ".body": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    width: "100%",
    gap: "$sm",
    flexWrap: "wrap",
  },
  ".header": {
    boxSizing: "border-box",
    paddingBottom: "$sm",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid $text",

    "> div": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "$sm",
    },

    ".identity": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$xs",
      path: { fill: "$text" },
      span: {
        lineHeight: 0,
      },
    },
    ".latency": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$xs",
      span: {
        lineHeight: 0,
        color: "$accent",
      },
    },
    ".icons": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$sm",
      span: {
        lineHeight: 0,
      },
      ".active": {
        path: {
          stroke: "$text",
          fill: "$text",
        },
      },
      ".inactive": {
        path: {
          stroke: "$grey",
          fill: "$grey",
        },
      },
      ".audio.inactive": {
        path: {
          fill: "none",
          "&:last-child": {
            fill: "$grey",
          },
        },
      },
      ".audio.active": {
        path: {
          fill: "none",
          "&:last-child": {
            fill: "$text",
          },
        },
      },
    },
  },
});

const StyledSubcard = styled("button", {
  appearance: "none",
  outline: "none",
  // background: "$background",
  borderRadius: "$xs",
  padding: "$xs $sm",
  display: "flex",
  flexDirection: "row",
  gap: "$xs",
  alignItems: "center",
  justifyContent: "start",
  path: {
    stroke: "$text",
  },
  span: {
    color: "$text",
    fontWeight: "$semibold",
    lineHeight: 0,
  },
  "&:hover": {
    background: "$brand",
    cursor: "pointer",
  },
  variants: {
    active: {
      true: {
        background: "$negative",
        border: "1px solid $text",
      },
      false: {
        background: "$backgroundGradient",
        border: "1px solid $text",
      },
    },
  },
});

async function applyAudioSetting(
  type: string,
  room_name: string,
  participant: string,
  target: string
) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/apply-setting`,
    {
      method: "PATCH",
      body: JSON.stringify({
        type,
        room_name,
        participant,
        target,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

async function applyDelay(
  room_name: string,
  participant: string,
  delay: string
) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/apply-setting`,
    {
      method: "PATCH",
      body: JSON.stringify({
        type: "UPDATE_DELAY",
        room_name,
        participant,
        delay: parseInt(delay),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

function ParticipantSubcard({
  target,
  muted,
  onClick,
}: {
  target: any;
  muted: boolean;
  onClick?: MouseEventHandler;
}) {
  return (
    <StyledSubcard active={muted} onClick={onClick}>
      {muted ? (
        <VolumeMuteSharp color="#fff" width="18px" />
      ) : (
        <VolumeHighSharp color="#fff" width="18px" />
      )}
      <Text size="2xs">{target.identity}</Text>
    </StyledSubcard>
  );
}

export default function AudioMixCard({
  audioMixMute,
  audioDelay,
  participants,
  thisParticipant,
  roomName,
  type,
  passcode,
  room,
}: {
  audioMixMute: string[];
  audioDelay?: number;
  thisParticipant: Participant;
  participants: Participant[];
  roomName: string;
  type: "PERFORMER" | "CONTROL" | "SCOUT";
  passcode: string;
  room?: Room;
}) {
  const performerParticipants = participants.filter((p) => {
    try {
      const meta = JSON.parse(p.metadata || "{}");
      return meta.type === "PERFORMER" || meta.type === "SCOUT";
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  const [ping, setPing] = useState(0);
  const { toast } = useToast();

  const isPublishingAudio =
    thisParticipant && thisParticipant.audioTracks.size > 0;
  const isPublishingVideo =
    thisParticipant && thisParticipant.videoTracks.size > 0;

  let isControl = false;

  try {
    const meta = thisParticipant && JSON.parse(thisParticipant.metadata || "");
    isControl = meta.type === "CONTROL";
  } catch (err) {
    console.log(err);
  }

  useEffect(() => {
    if (isControl) {
      return;
    }

    if (!room) {
      return;
    }

    let pingIntervalId: number | undefined;
    let pingIdentifier: number = Math.floor(Math.random() * 100);
    let pingTimestamp = Date.now();

    function parseDataReceived(payload: Uint8Array) {
      const decoder = new TextDecoder();
      const data = decoder.decode(payload);
      try {
        const json = JSON.parse(data) as ServerUpdate;
        if (json.type === "pong") {
          if (
            json.target === room?.localParticipant.identity &&
            json.id === pingIdentifier
          ) {
            const pingDuration = Math.floor(Date.now() - pingTimestamp);
            setPing(pingDuration);
          }
        }
      } catch (err) {}
    }

    if (room.state === ConnectionState.Connected) {
      room.on(RoomEvent.DataReceived, parseDataReceived);
      pingIntervalId = window.setInterval(() => {
        pingIdentifier = Math.floor(Math.random() * 100);
        pingTimestamp = Date.now();
        const payload = JSON.stringify({
          type: "ping",
          target: room.localParticipant.identity,
          id: pingIdentifier,
        } as PingPayload);
        const encoder = new TextEncoder();
        const data = encoder.encode(payload);
        room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
          thisParticipant as RemoteParticipant,
        ]);
      }, 5000);
    } else {
      room.off(RoomEvent.DataReceived, parseDataReceived);
      window.clearInterval(pingIntervalId);
    }

    return () => {
      room.off(RoomEvent.DataReceived, parseDataReceived);
      clearInterval(pingIntervalId);
    };
  }, [room, room?.state, thisParticipant, isControl]);

  return (
    <StyledDiv type={type}>
      <div>
        <div className="header">
          <div>
            <div className="identity">
              {type === "SCOUT" ? (
                <Telescope color="inherit" width="20px" height="20px" />
              ) : type === "CONTROL" ? (
                <DesktopOutline color="inherit" width="20px" height="20px" />
              ) : (
                <PersonCircle color="inherit" width="20px" height="20px" />
              )}

              <Text size="xs">{thisParticipant?.identity}</Text>
            </div>
            {!thisParticipant.isLocal && (
              <div className="latency">
                <SwapHorizontal color="inherit" width="20px" height="20px" />
                <Text size="xs">{ping === 0 ? "-" : ping}</Text>
              </div>
            )}
          </div>
          <div className="icons">
            {!isControl && (
              <>
                <div
                  className={
                    isPublishingAudio ? "audio active" : "audio inactive"
                  }
                >
                  <MicSharp width="20px" color={"inherit"} />
                </div>
                <div
                  className={
                    isPublishingVideo ? "video active" : "video inactive"
                  }
                >
                  <VideocamSharp width="20px" color="inherit" />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="body">
          {performerParticipants
            .filter((p) => p.identity !== thisParticipant?.identity)
            .map((p) => {
              if (p.audioTracks.size > 0) {
                return (
                  <ParticipantSubcard
                    onClick={() => {
                      if (
                        audioMixMute.findIndex((_p) => _p === p.identity) < 0
                      ) {
                        applyAudioSetting(
                          "MUTE_AUDIO",
                          roomName,
                          thisParticipant.identity,
                          p.identity
                        )
                          .then(() => {})
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        applyAudioSetting(
                          "UNMUTE_AUDIO",
                          roomName,
                          thisParticipant.identity,
                          p.identity
                        )
                          .then(() => {})
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    }}
                    key={`${p.identity}_${
                      audioMixMute.findIndex((_p) => _p === p.identity) < 0
                        ? "mute"
                        : "unmute"
                    }`}
                    muted={
                      audioMixMute.findIndex((_p) => _p === p.identity) > -1
                    }
                    target={p}
                  />
                );
              } else {
                return false;
              }
            })}
        </div>
      </div>
      {["PERFORMER", "SCOUT"].indexOf(type) > -1 && (
        <div className="footer">
          <div className="footer-box stream-link">
            <div className="header">
              <LinkOutline color="inherit" width="14px" />
              <Text size="2xs" css={{ textTransform: "uppercase" }}>
                Copy Stream Link
              </Text>
            </div>
            <div className="buttons">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.REACT_APP_OUTPUT_HOST}/?room=${roomName}&passcode=${passcode}&target=${thisParticipant.identity}&withAudio=false&withVideo=true`
                  );
                  toast({
                    title: "Copied",
                    description: `${thisParticipant.identity} video only link`,
                  });
                }}
                size="sm"
                variant="outline"
                css={{
                  path: {
                    fill: "$text",
                  },
                  span: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <VideocamSharp color="inherit" width="20px" />
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.REACT_APP_OUTPUT_HOST}/?room=${roomName}&passcode=${passcode}&target=${thisParticipant.identity}&withVideo=false&withAudio=true`
                  );
                  toast({
                    title: "Copied",
                    description: `${thisParticipant.identity} audio only link`,
                  });
                }}
                size="sm"
                variant="outline"
                css={{
                  path: {
                    fill: "$text",
                  },
                  span: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <VolumeHighSharp color="inherit" width="21px" />
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.REACT_APP_OUTPUT_HOST}/?room=${roomName}&passcode=${passcode}&target=${thisParticipant.identity}&withAudio=true&withVideo=true`
                  );
                  toast({
                    title: "Copied",
                    description: `${thisParticipant.identity} video + audio link`,
                  });
                }}
                size="sm"
                variant="outline"
                css={{
                  span: {
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 0,
                    path: {
                      fill: "$text",
                    },
                    "path:not(:last-child)": {
                      fill: "none",
                    },
                  },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideocamSharp color="inherit" width="20px" /> +{" "}
                <VolumeHighSharp color="inherit" width="20px" />
              </Button>
              <input
                type="text"
                className="hidden"
                id={`stream_url_${thisParticipant.sid}`}
                // value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${nickname}`}
                readOnly
              />

              <input
                type="text"
                className="hidden"
                id={`stream_url_a_${thisParticipant.sid}`}
                // value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${nickname}&audio=1`}
                readOnly
              />
            </div>
          </div>
          <div className="spacer" />
          <div className="footer-box audio-delay">
            <div className="header">
              <HourglassOutline color="inherit" width="14px" />
              <Text size="2xs" css={{ textTransform: "uppercase" }}>
                Output Audio Delay
              </Text>
            </div>
            <div className="inputs">
              <div className="input-group">
                <Input
                  id={`desired_delay_${thisParticipant.sid}`}
                  type="text"
                  css={{
                    fontSize: "$xs",
                    border: "1px solid $text",
                    backgroundColor: "$videoBackgroundGradient",
                    color: "$text",
                    borderRadius: 0,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      let delayInput: any = document.getElementById(
                        `desired_delay_${thisParticipant.sid}`
                      );
                      let _delay: number = parseInt(delayInput.value);
                      if (!isNaN(_delay)) {
                        applyDelay(
                          roomName,
                          thisParticipant.identity,
                          _delay.toString()
                        );
                      }
                      delayInput.value = null;
                    }
                  }}
                />
                <Button
                  size="sm"
                  css={{
                    display: "flex",
                    padding: "0",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    border: "1px solid $text",
                    borderRadius: 0,
                    width: "60px",
                  }}
                  onClick={() => {
                    let delayInput: any = document.getElementById(
                      `desired_delay_${thisParticipant.sid}`
                    );
                    let _delay: number = parseInt(delayInput.value);
                    if (!isNaN(_delay)) {
                      applyDelay(
                        roomName,
                        thisParticipant.identity,
                        _delay.toString()
                      );
                    }
                    delayInput.value = null;
                  }}
                >
                  <ArrowForward color="white" style={{ display: "block" }} />
                </Button>
                <div className="delay-display">
                  <GitCommitOutline
                    style={{ display: "block" }}
                    width={10}
                    color={"white"}
                  />{" "}
                  {audioDelay}ms
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </StyledDiv>
  );
}
