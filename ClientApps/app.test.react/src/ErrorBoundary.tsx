import { Component, ErrorInfo, MouseEvent, PropsWithChildren } from "react";

interface State {
  error?: Error;
}

const INITIAL_STATE: State = {};

/**
 * A component to catch and report errors in the component tree so the user does not end up with a blank screen in production.
 * See https://reactjs.org/docs/error-boundaries.html
 */
export default class ErrorBoundary extends Component<PropsWithChildren, State> {
  public state = INITIAL_STATE;

  public static getDerivedStateFromError(error: Error): State {
    return {
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      "ErrorBoundary caught error:",
      error instanceof Error ? error.message : String(error)
    );
  }

  public render() {
    const { error } = this.state;
    if (error) {
      return (
        <>
          <h1>An error has occurred</h1>
          <p>{error instanceof Error ? error.message : String(error)}</p>
          <p>
            <button onClick={this.handleRecover}>Continue</button>
          </p>
        </>
      );
    } else if (this.props.children) {
      return this.props.children;
    } else {
      return null;
    }
  }

  private handleRecover = (evt: MouseEvent) => {
    evt.preventDefault();
    window.location.reload();
  };
}
