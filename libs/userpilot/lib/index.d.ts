export module Userpilot {
  /**
   * Init
   * @override
   */
  export function initialize(str: string, data?: { nonce?: string }): string;
  /**
   * Reload
   * @param Object
   */
  export function reload(url?: any): void;

  /**
   * Identify
   * @param String, Object
   */
  export function identify(userid: string, pramaters?: Object): void;

  /**
   * Suppress
   */
  export function suppress(): void;

  /**
   * Trigger
   * @param String
   */
  export function trigger(token: string): void;

  /**
   * anonymous
   * @param Object
   */
  export function anonymous(data?: Object): void;

  /**
   * on
   * @param String, Any
   */
  export function on(event: string, cb: any): void;

  /**
   * once
   * @param String, Any
   */
  export function once(event: string, cb: any): void;

  /**
   * off
   * @param String
   */
  export function off(event: string): void;

  /**
   * track
   * @param String, Object
   */
  export function track(event: string, meta?: Object): void;

  /**
   * reset
   */
  export function reset(): void;

  /**
   * next
   */
  export function next(): void;

  /**
   * end
   * @param String
   */
  export function end(type?: string): void;

  /**
   * clean
   */
  export function clean(): void;

  /**
   * destroy
   */
  export function destroy(): void;
}
