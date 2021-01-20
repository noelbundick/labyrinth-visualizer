export default function Analyze(props) {
  const path = props.match.path as string;
  const forward = path.endsWith('to');
  return (
    <div>
      <h1>Analyze Mode</h1>
      <p>Path: {path}</p>
      <p>Forward: {String(forward)}</p>
      <p>Start: {props.match.params.start ?? "(undefined)"}</p>
      <p>End: {props.match.params.end ?? "(undefined)"}</p>
    </div>
  );
}
