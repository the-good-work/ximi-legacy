import {
  ParticipantPerformer,
  RoomUpdateAction,
  RoomUpdatePayload,
  Slot,
  VideoLayout,
} from "@thegoodwork/ximi-types/src/room";
import { Participant, Room } from "livekit-client";
import { useState } from "react";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";

const videoLayouts = [
  {
    image: "images/video-layouts/layout-default.png",
    name: "Default",
    layout: [],
  },

  {
    image: "images/video-layouts/layout-a.png",
    name: "A",
    layout: ["1 / 1 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-b.png",
    name: "B",

    layout: ["1 / 4 / 7 / 10", "7 / 4 / 13 / 10"],
  },
  {
    image: "images/video-layouts/layout-c.png",
    name: "C",
    layout: ["4 / 1 / 10 / 7", "4 / 7 / 10 / 13"],
  },
  {
    image: "images/video-layouts/layout-d.png",
    name: "D",
    layout: ["1 / 4 / 7 / 10", "7 / 1 / 13 / 7", "7 / 7 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-e.png",
    name: "E",
    layout: ["1 / 1 / 7 / 7", "1 / 7 / 7 / 13", "7 / 4 / 13 / 10"],
  },

  {
    image: "images/video-layouts/layout-f.png",
    name: "F",
    layout: ["1 / 1 / 13 / 7", "1 / 7 / 7 / 13", "7 / 7 / 13 / 13"],
  },

  {
    image: "images/video-layouts/layout-g.png",
    name: "G",
    layout: ["1 / 4 / 7 / 10", "7 / 1 / 13 / 7", "7 / 7 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-h.png",
    name: "H",

    layout: ["5 / 1 / 9 / 5", "5 / 5 / 9 / 9", "5 / 9 / 9 / 13"],
  },
  {
    image: "images/video-layouts/layout-i.png",
    name: "I",
    layout: ["1 / 1 / 13 / 5", "1 / 5 / 13 / 9", "1 / 9 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-j.png",
    name: "J",
    layout: [
      "1 / 1 / 7 / 7",
      "1 / 7 / 7 / 13",
      "7 / 1 / 13 / 7",
      "7 / 7 / 13 / 13",
    ],
  },
  {
    image: "images/video-layouts/layout-k.png",
    name: "K",
    layout: [
      "1 / 1 / 13 / 4",
      "1 / 4 / 13 / 7",
      "1 / 7 / 13 / 10",
      "1 / 10 / 13 / 13",
    ],
  },
];

async function applyVideoSetting(
  room_name: string,
  participant: string,
  layout: VideoLayout,
  slots: Slot[]
) {
  const action: RoomUpdateAction & { type: "UPDATE_LAYOUT" } = {
    type: "UPDATE_LAYOUT",
    room_name,
    participant,
    layout,
    slots,
  };

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/apply-setting`,
    {
      method: "PATCH",
      body: JSON.stringify(action),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}

const VideoGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridTemplateRows: "repeat(12, 1fr)",
  minHeight: "400px",
  width: "100%",
  height: "calc(100vh - 9.75rem - 157px)",
  border: "2px solid $brand",
});

const ParticipantVideo = styled("div", {
  background: "$videoBackgroundGradient",
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  padding: "$md",
  boxSizing: "border-box",

  select: {
    position: "absolute",
    top: "$xs",
    left: "$xs",
  },

  video: {
    position: "absolute",
    top: "0",
    left: "0",
  },
});

const ParticipantLayout = styled("button", {
  appearance: "none",
  outline: "none",
  border: "1px solid $brand",
  padding: "$2xs",
  background: "$background",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "100px",
  gap: "$2xs",
  fontWeight: "$normal",

  "> div": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "20px",
    img: {
      display: "block",
      width: "100%",
    },
  },

  "&:hover": {
    cursor: "pointer",
    background: "$brand",
  },

  "&.active": {
    background: "$brand",
  },
});

const StyledVideoPanel = styled("div", {
  display: "flex",
  boxSizing: "border-box",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  border: "2px solid $brand",
  backgroundColor: "$background",
  padding: "$xs",
  gap: "$sm",

  ".layouts": {
    gap: "$sm",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    padding: "0 $lg",
    alignItems: "center",

    ".item": {
      appearance: "none",
      outline: "none",
      background: "$background",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "$2xs",
      border: "1px solid $brand",
      width: "50px",
      img: {
        objectFit: "contain",
        width: "100%",
      },
      "&:hover": {
        cursor: "pointer",
        background: "$brand",
      },
    },
    ".active": {
      background: "$brand",
    },
  },
  ".participants": {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "$sm",
    borderTop: "1px solid $brand",
    padding: "$sm 0 0 0",
  },
});

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export default function VideoPanel({
  room,
  participants,
  participantsSettings,
}: {
  room?: Room;
  participants?: Participant[];
  participantsSettings?: (Unpacked<
    RoomUpdatePayload["update"]["participants"]
  > & { type: "PERFORMER" })[];
}) {
  const [currentLayout, setCurrentLayout] = useState<string>("Default");

  const performers =
    participants && participants?.length > 0
      ? participants.filter((p: Participant) => {
          try {
            const meta = JSON.parse(p.metadata || "");
            return meta?.type === "PERFORMER" ? true : false;
          } catch (err) {
            return false;
          }
        })
      : [];

  const [activePerformer, setActivePerformer] = useState<Participant>(
    performers?.[0]
  );

  if (!room || !participantsSettings || !participants) {
    return <></>;
  }

  if (performers.length < 1) {
    return (
      <div
        style={{
          color: "white",
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Awaiting performers
      </div>
    );
  }

  const thisParticipantSetting = participantsSettings.find(
    (p) => p.name === activePerformer.identity
  );

  return (
    <StyledVideoPanel>
      <VideoGrid>
        {thisParticipantSetting &&
          thisParticipantSetting.video.slots.map((slot, i) => {
            const x1 = slot.position.x * 12 + 1;
            const x2 = x1 + slot.size.w * 12;
            const y1 = slot.position.y * 12 + 1;
            const y2 = y1 + slot.size.h * 12;

            const gridArea = `${y1} / ${x1} / ${y2} / ${x2}`;
            return (
              <ParticipantVideo key={i} css={{ gridArea }}>
                <select
                  value={slot.nickname || "empty"}
                  onChange={(e) => {
                    const _slots = [...thisParticipantSetting.video.slots];
                    _slots[i].nickname = e.target.value;
                    applyVideoSetting(
                      room.name,
                      thisParticipantSetting.name,
                      thisParticipantSetting.video.layout,
                      _slots
                    );
                  }}
                >
                  {performers.map((p) => (
                    <option key={p.identity} value={p.identity}>
                      {p.identity}
                    </option>
                  ))}
                  <option value={"empty"}>--</option>
                </select>
              </ParticipantVideo>
            );
          })}
      </VideoGrid>
      <div className="layouts">
        {videoLayouts.map((l) => {
          return (
            <button
              key={l.name}
              onClick={async () => {
                const thisParticipantSetting = participantsSettings.find(
                  (p) => p.name === activePerformer.identity
                );
                if (!thisParticipantSetting) {
                  return;
                }
                const _slots = [...thisParticipantSetting.video.slots];
                const newLayout = videoLayouts.find(
                  (layout) => layout.name === l.name
                );

                if (!newLayout) {
                  return;
                }
                const newSlots = newLayout.layout.map((l) =>
                  l.split("/").map((n) => parseInt(n.trim()))
                );
                const newSlotLength = newLayout.layout.length;

                if (l.name !== "Default") {
                  const __slots = new Array(newSlotLength)
                    .fill({
                      size: { w: 0, h: 0 },
                      position: { x: 0, y: 0 },
                      nickname: "",
                    } as Slot)
                    .map((slot, i) => {
                      const newSlot = newSlots[i];
                      const w = (newSlot[3] - newSlot[1]) / 12;
                      const x = (newSlot[1] - 1) / 12;

                      const h = (newSlot[2] - newSlot[0]) / 12;
                      const y = (newSlot[0] - 1) / 12;

                      return {
                        ...slot,
                        size: { w, h },
                        position: { x, y },
                        nickname: _slots?.[i]?.nickname,
                      };
                    });

                  await applyVideoSetting(
                    room.name,
                    activePerformer.identity,
                    l.name as VideoLayout,
                    __slots
                  );
                } else {
                  // default video slot

                  await applyVideoSetting(
                    room.name,
                    activePerformer.identity,
                    l.name as VideoLayout,
                    []
                  );
                }
              }}
              className={`item layout-${l.name} ${
                l.name ===
                (participantsSettings as ParticipantPerformer[])?.find(
                  (p) => p.name === activePerformer.identity
                )?.video.layout
                  ? "active"
                  : ""
              }`}
            >
              <img src={l.image} alt={`Layout ${l.name}`} />
            </button>
          );
        })}
      </div>

      <div className="participants">
        {performers.map((p: Participant) => {
          const thisPerformerSettings = (
            participantsSettings as ParticipantPerformer[]
          ).find((q) => q.name === p.identity);
          const currentLayout = thisPerformerSettings?.video.layout;
          const activeVideoLayout = videoLayouts.find(
            (l) => l.name === currentLayout
          );

          return (
            <ParticipantLayout
              className={
                activePerformer.identity === p.identity ? "active" : ""
              }
              onClick={() => {
                setActivePerformer(p);
              }}
            >
              <div>
                <img
                  src={activeVideoLayout?.image}
                  alt={activeVideoLayout?.name}
                />
              </div>
              <Text size="xs">{p.identity}</Text>
            </ParticipantLayout>
          );
        })}
      </div>
    </StyledVideoPanel>
  );
}
