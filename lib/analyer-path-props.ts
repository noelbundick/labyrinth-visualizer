export enum Direction {
  TO,
  FROM
}

export class AnalyzerPathProps {
  direction: Direction;
  startKey: string;
  endKey: string;
  redirect: boolean;

  constructor(pathname: string) {
    const [ignore, mode, direction, start, end] = pathname.split('/');
    // console.log(`pathname = "${pathname}"`);
    // console.log(`mode = "${mode}"`);
    // if (mode !== 'analyze') {
    //   const message = `Bad path "${pathname}" "${mode}".`;
    //   throw new TypeError(message);
    // }

    this.redirect = (
      direction === undefined ||
      start === undefined ||
      end === undefined
    );

    if (direction === 'to') {
      this.direction = Direction.TO;
    } else if (direction === 'from') {
      this.direction = Direction.FROM;
    } else if (direction === undefined) {
      this.direction = Direction.TO;
    } else {
      const message = `Bad direction: "${direction}".`;
      throw new TypeError(message);
    }

    this.startKey = start ?? 'internet';
    this.endKey = end ?? 'subnet3';
  }

  to() {
    return [
      '/analyze',
      'to',
      this.startKey,
      this.endKey
    ].join('/');
  }

  from() {
    return [
      '/analyze',
      'from',
      this.startKey,
      this.endKey
    ].join('/');
  }

  start(name: string) {
    return [
      '/analyze',
      this.direction === Direction.FROM ? 'from' : 'to',
      name,
      this.endKey
    ].join('/');
  }

  end(name: string) {
    return [
      '/analyze',
      this.direction === Direction.FROM ? 'from' : 'to',
      this.startKey,
      name
    ].join('/');
  }

  path() {
    return [
      '/analyze',
      this.direction === Direction.FROM ? 'from' : 'to',
      this.startKey,
      this.endKey
    ].join('/');
  }
}
