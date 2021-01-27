import { dir } from 'console';
import {NodeSpec} from 'labyrinth-nsg';

export enum Direction {
  TO,
  FROM
}

export class AnalyzerPathProps {
  isOutbound: boolean;
  startKey: string;
  endKey?: string;
  redirect: boolean;

  static create(pathname: string, nodes?: NodeSpec[]): AnalyzerPathProps {
    const [ignore, mode, direction, start, end] = pathname.split('/');
    return new AnalyzerPathProps(direction, start, end, nodes);
  }

  constructor(
    direction?: string,
    start?: string,
    end?: string,
    nodes?: NodeSpec[]
  ) {
    this.redirect = (
      direction === undefined ||
      start === undefined ||
      end === undefined
    );

    if (direction === 'to') {
      this.isOutbound = false;
    } else if (direction === 'from' || direction === undefined) {
      this.isOutbound = true;
    } else {
      // TODO: don't throw here.
      const message = `Bad direction: "${direction}".`;
      throw new TypeError(message);
    }

    if (start !== undefined) {
      this.startKey = start;
      // TODO: consider checking whether start is in nodes[]
      // Check is currently in AnalyzeMode.renderPage()
    } else if (nodes !== undefined && nodes.length > 0) {
      this.startKey = nodes[0].key;
    } else {
      const message = 'startKey undefined and nodes undefined or empty';
      throw new TypeError(message);
      // this.startKey = 'error'; // TODO: handle this case.
    }

    this.endKey = end;
  }

  clone(): AnalyzerPathProps {
    const constructor = this.constructor as {
      new(
        ...args: ConstructorParameters<typeof AnalyzerPathProps>
      ): AnalyzerPathProps
    };

    return new constructor(
      this.isOutbound ? 'from' : 'to',
      this.startKey,
      this.endKey
    );
  }

  to(): AnalyzerPathProps {
    const a = this.clone();
    a.isOutbound = false;
    return a;
  }
  // to() {
  //   return [
  //     '/analyze',
  //     'to',
  //     this.startKey,
  //   ].join('/');
  // }

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
      this.isOutbound ? 'from' : 'to',
      name,
    ].join('/');
  }

  end(name: string) {
    return [
      '/analyze',
      this.isOutbound ? 'from' : 'to',
      this.startKey,
      name
    ].join('/');
  }

  path() {
    return [
      '/analyze',
      this.isOutbound ? 'from' : 'to',
      this.startKey,
      this.endKey
    ].join('/');
  }
}
