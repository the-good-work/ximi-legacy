import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack, ReturnDownForward } from "react-ionicons";
import { ApiPayload } from "@thegoodwork/ximi-types";
import { UpdateStateActions } from "../../../../types/controlStates";
import Text from "ui/Texts/Text";
import Input from "ui/Form/Input";
import { ScreenContainer } from "ui/Composites/ScreenContainer";
import Button from "ui/Buttons/Button";
import { styled } from "ui/theme/theme";
import { useToast } from "ui/Feedback/Toast";

const Group = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "$lg",

  ".button-group": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "$lg",
    flexDirection: "row",
  },
});

export default function CreateRoom({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  type Room = { name: string; passcode: string };

  const [room, setRoom] = useState<Room>({ name: "", passcode: "" });
  const { toast } = useToast();

  const passcodeKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "clr",
    "bsp",
    "ent",
  ];

  const roomNameKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "bsp",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "clr",
    "confirm",
  ];

  async function createRoom() {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_HOST}/rooms/create`,
      {
        method: "POST",
        body: JSON.stringify({
          name: room.name,
          passcode: room.passcode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  async function onCreate() {
    try {
      const createRoomResponse = await createRoom();
      const json: ApiPayload = await createRoomResponse.json();

      if (json.status !== "success") {
        throw Error(json.error);
      }

      updateState({
        type: "confirm-create-room",
        room: {
          room: room.name,
          passcode: room.passcode,
          participants: 1,
        },
        token: json.data.token,
      });
    } catch (err: any) {
      console.log({ err });
      toast({
        title: "Error creating room",
        description: err.message || "Please try again later",
        tone: "warning",
      });
    }
  }

  const handlePasscode = (key: string) => {
    const numberKey = key.slice(-1);

    if (key === "Enter" || key === "ent") {
      onCreate();
    } else if (key === "Backspace" || key === "bsp") {
      setRoom({ ...room, passcode: room.passcode.slice(0, -1) });
    } else if (key === "clr") {
      setRoom({ ...room, passcode: room.passcode.slice(0, -5) });
    } else if (passcodeKeys.indexOf(numberKey) !== -1) {
      setRoom({
        ...room,
        passcode: `${room.passcode}${numberKey}`.slice(0, 5),
      });
    } else return;
  };

  const handleName = (key: string) => {
    const textKey = key.slice(-1);

    if (key === "Enter" || key === "ent") {
      onCreate();
    } else if (key === "Backspace" || key === "bsp") {
      setRoom({ ...room, name: room.name.slice(0, -1) });
    } else if (key === "clr") {
      setRoom({ ...room, name: room.name.slice(0, -10) });
    } else if (roomNameKeys.indexOf(textKey) !== -1) {
      setRoom({ ...room, name: `${room.name}${textKey}`.slice(0, 10) });
    } else return;
  };

  return (
    <div className="content noscroll">
      <ScreenContainer>
        <Group
          className="heading"
          css={{
            div: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <div>
            <Heading
              color="gradient"
              css={{
                textAlign: "center",
                textTransform: "uppercase",
                marginTop: "$sm",
                marginBottom: "$sm",
              }}
            >
              Create Room
            </Heading>
          </div>
          <Text
            color="white"
            size="sm"
            css={{ textTransform: "uppercase", fontWeight: "$medium" }}
          >
            Room Name (max 10 chars)
          </Text>
          <Input
            onKeyDown={(e) => {
              const target = e.code;
              handleName(target);
            }}
            value={room.name}
            maxLength={"10"}
            inputMode="text"
            css={{
              fontSize: "$2xl",
              maxWidth: "450px",
            }}
            type="text"
          />

          <Text
            color="white"
            size="sm"
            css={{ textTransform: "uppercase", fontWeight: "$medium" }}
          >
            Passcode (5 digits)
          </Text>

          <Input
            onKeyDown={(e) => {
              const target = e.code;
              handlePasscode(target);
            }}
            value={room.passcode}
            pattern="[0-9]*"
            maxLength={"5"}
            inputMode="numeric"
            css={{
              fontSize: "$2xl",
              maxWidth: "450px",
            }}
            type="password"
          />
          <div className="button-group">
            <Button
              onClick={() => {
                updateState({
                  type: "back-to-list",
                });
              }}
              css={{ path: { fill: "transparent" }, justifyContent: "center" }}
              icon={<ReturnDownBack color="inherit" />}
            >
              Back
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onCreate();
              }}
              css={{ path: { fill: "transparent" }, justifyContent: "center" }}
              icon={<ReturnDownForward color="inherit" />}
            >
              Confirm
            </Button>
          </div>
        </Group>
      </ScreenContainer>
    </div>
  );
}
