interface MyCardsProps {
  rank: String;
  suit: String;
}

function TableCard({ rank, suit }: MyCardsProps) {
  return (
    <li>
      <div className={"card rank-" + rank + " " + suit}>
        <span className="rank">{rank}</span>
        <span className="suit"></span>
      </div>
    </li>
  );
}
export default TableCard;
