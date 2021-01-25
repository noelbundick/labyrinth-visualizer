import {NodeSpec} from 'labyrinth-nsg';

export enum Direction {
  TO,
  FROM
}

export class AnalyzerPathProps {
  direction: Direction;
  startKey: string;
  endKey?: string;
  redirect: boolean;

  constructor(pathname: string, nodes: NodeSpec[] | undefined) {
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
      this.direction = Direction.FROM;
    } else {
      // TODO: don't throw here.
      const message = `Bad direction: "${direction}".`;
      throw new TypeError(message);
    }

    if (start !== undefined) {
      this.startKey = start;
    } else if (nodes !== undefined && nodes.length > 0) {
      this.startKey = nodes[0].key;
    } else {
      this.startKey = 'error'; // TODO: handle this case.
    }

    this.endKey = end;
  }

  to() {
    return [
      '/analyze',
      'to',
      this.startKey,
    ].join('/');
  }

  from() {
    return [
      '/analyze',
      'from',
      this.startKey,
    ].join('/');
  }

  start(name: string) {
    return [
      '/analyze',
      this.direction === Direction.FROM ? 'from' : 'to',
      name,
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
