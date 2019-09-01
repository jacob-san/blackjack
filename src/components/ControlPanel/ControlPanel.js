import React from "react";
import "./ControlPanel.scss";
import BetInput from "../BetInput/BetInput";
import GameButton from "../GameButton/GameButton";
import ChipsTally from "../ChipsTally/ChipsTally";
import RigDeckCheckbox from "../RigDeckCheckbox/RigDeckCheckbox";
import { isSplittableHand } from "../../utils";
import { isEqual, cloneDeep } from "lodash";

const ControlPanel = ({
  deck,
  setDeck,
  bet,
  setBet,
  chips,
  setChips,
  playerHands,
  setPlayerHands,
  currentHand,
  setCurrentHand,
  turn,
  setTurn,
  toggleIsRiggedForSplits
}) => {
  //----------------------------------------------------------------//
  //                         HELPERS                                //
  //----------------------------------------------------------------//
  const hitPlayer = () => {
    //make copies
    const deckCopy = [...deck];
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = cloneDeep(currentHand);

    //deal a new card to the current hand
    const newCard = deckCopy.pop();
    currentHandCopy.cards.push(newCard);

    //replace the old hand with the new hand
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    handsCopy.splice(currentHandIndex, 1, currentHandCopy);

    //update state
    setPlayerHands(handsCopy);
    setCurrentHand(currentHandCopy);
    setDeck(deckCopy);
  };

  const handleSplit = () => {
    //make copies
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = cloneDeep(currentHand);

    //replace the hand with 2 split hands
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    handsCopy.splice(
      currentHandIndex,
      1,
      { cards: [currentHandCopy.cards[0]], bet },
      { cards: [currentHandCopy.cards[1]], bet }
    );

    //update state
    setCurrentHand(handsCopy[0]);
    setPlayerHands(handsCopy);
    const newBet = (bet * handsCopy.length) / (handsCopy.length - 1);
    setBet(newBet);
    setChips(chips => chips - (newBet - bet));
  };

  const handleStand = () => {
    const handsCopy = cloneDeep(playerHands);
    const currentIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    const nextHand = handsCopy[currentIndex + 1];
    if (nextHand) {
      setCurrentHand(nextHand);
    } else {
      setTurn("dealer");
    }
  };

  return (
    <>
      <ChipsTally chips={chips} />
      {bet === 0 && (
        <>
          <BetInput setBet={setBet} chips={chips} setChips={setChips} />
          <RigDeckCheckbox
            onChange={() => toggleIsRiggedForSplits(bool => !bool)}
          />
        </>
      )}
      {turn === "player" && bet > 0 && (
        <>
          <GameButton onClick={hitPlayer} content="Hit" />
          <GameButton onClick={handleStand} content="Stand" />
          <GameButton onClick={() => {}} content="Double Down" />
          {isSplittableHand(currentHand) && (
            <GameButton onClick={handleSplit} content="Split" />
          )}
        </>
      )}
    </>
  );
};

export default ControlPanel;
