import {
  useRemoteParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useState } from "react";
import { XimiParticipantState } from "types";
import * as classNames from "classnames";

const clsSidebarBtn = (active: boolean) =>
  classNames(
    "px-2 py-1 cursor-pointer text-sm",
    active
      ? "bg-brand hover:bg-brand/75"
      : "bg-[transparent] hover:bg-brand/50",
  );

const ScoutText = () => {
  const participants = useRemoteParticipants();
  const filteredParticipants = participants
    .filter((p) => {
      try {
        if (p.metadata === undefined) {
          return false;
        }
        const pMeta = JSON.parse(p.metadata) as XimiParticipantState;
        return pMeta.role === "SCOUT";
      } catch (err) {
        console.warn(err);
        return false;
      }
    })
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));
  const [selectedScout, setSelectedScout] = useState<string>();

  if (filteredParticipants.length < 1) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
        Waiting for{" "}
        <span className="text-xs relative top-[.1em] mx-1 p-1 inline-block border leading-3 rounded-sm">
          SCOUT
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-stretch">
      <div className="w-20 text-sm border-r md:w-40 md:text-base border-brand">
        {filteredParticipants.map((p) => (
          <div
            key={p.identity}
            className={clsSidebarBtn(selectedScout === p.identity)}
            onClick={() => {
              setSelectedScout(() => p.identity);
            }}
          >
            {p.identity}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center flex-grow">
        {selectedScout === undefined ? (
          <div>
            Select
            <span className="text-xs relative top-[-.05em] mx-1 p-1 inline-block border leading-3 rounded-sm">
              SCOUT
            </span>{" "}
            on sidebar
          </div>
        ) : (
          <TextPosterEditor identity={selectedScout} />
        )}
      </div>
    </div>
  );
};

const TextPosterEditor = ({ identity }: { identity: string }) => {
  const p = useRemoteParticipant(identity);

  try {
    const pMeta = JSON.parse(p?.metadata || "") as XimiParticipantState;

    return (
      <div className="w-full h-[calc(100vh-80px)] p-1">
        <div className="h-full p-1 border grid grid-rows-2 border-brand gap-1">
          <div className="flex flex-col items-center justify-center gap-4">
            <label className="text-sm text-center uppercase">
              Current text
            </label>
            <p className="text-3xl text-center">{pMeta.textPoster || "-"}</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <textarea
              placeholder={pMeta.textPoster || "Type here"}
              className="block w-full p-2 text-4xl text-center border h-36 text-text border-brand bg-bg"
            />
            <div className="flex gap-4">
              <button className="px-2 py-1 text-sm border rounded border-brand hover:bg-brand/25">
                Set {identity} text
              </button>
              <button className="px-2 py-1 text-sm border rounded border-brand hover:bg-brand/25">
                Set all scout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <div>Participant state error</div>;
  }
};

export { ScoutText };
