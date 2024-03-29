// Type definitions for React Router 6.0
// Project: https://github.com/ReactTraining/react-router
// Definitions by: Huy Nguyen <https://github.com/huy-nguyen>
//                 Philip Jackson <https://github.com/p-jackson>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Daniel Nixon <https://github.com/danielnixon>
//                 Tony Ward <https://github.com/ynotdraw>
//                 Marek Urbanowicz <https://github.com/murbanowicz>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module "react-router-dom" {
  import { match } from "react-router";
  import * as React from "react";
  import * as H from "history";

  export {
    generatePath,
    Prompt,
    MemoryRouter,
    RouteChildrenProps,
    RouteComponentProps,
    RouteProps,
    Route,
    Router,
    Routes,
    RoutesProps,
    StaticRouter,
    match,
    matchPath,
    withRouter,
    RouterChildContext,
    useLocation,
    useNavigate,
    useParams,
    useRouteMatch,
  } from "react-router";

  export interface BrowserRouterProps {
    basename?: string;
    getUserConfirmation?: (message: string, callback: (ok: boolean) => void) => void;
    forceRefresh?: boolean;
    keyLength?: number;
  }
  export class BrowserRouter extends React.Component<BrowserRouterProps, any> {}

  export interface HashRouterProps {
    basename?: string;
    getUserConfirmation?: (message: string, callback: (ok: boolean) => void) => void;
    hashType?: "slash" | "noslash" | "hashbang";
  }
  export class HashRouter extends React.Component<HashRouterProps, any> {}

  export interface LinkProps<S = H.LocationState> extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    component?: React.ComponentType<any>;
    to: H.LocationDescriptor<S> | ((location: H.Location<S>) => H.LocationDescriptor<S>);
    replace?: boolean;
    innerRef?: React.Ref<HTMLAnchorElement>;
  }
  export function Link<S = H.LocationState>(
    // TODO: Define this as ...params: Parameters<Link<S>> when only TypeScript >= 3.1 support is needed.
    props: React.PropsWithoutRef<LinkProps<S>> & React.RefAttributes<HTMLAnchorElement>,
  ): ReturnType<Link<S>>;
  export interface Link<S = H.LocationState>
    extends React.ForwardRefExoticComponent<
      React.PropsWithoutRef<LinkProps<S>> & React.RefAttributes<HTMLAnchorElement>
    > {}

  export interface NavLinkProps<S = H.LocationState> extends LinkProps<S> {
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    exact?: boolean;
    strict?: boolean;
    isActive?<Params extends { [K in keyof Params]?: string }>(match: match<Params>, location: H.Location<S>): boolean;
    location?: H.Location<S>;
  }
  export function NavLink<S = H.LocationState>(
    // TODO: Define this as ...params: Parameters<NavLink<S>> when only TypeScript >= 3.1 support is needed.
    props: React.PropsWithoutRef<NavLinkProps<S>> & React.RefAttributes<HTMLAnchorElement>,
  ): ReturnType<NavLink<S>>;
  export interface NavLink<S = H.LocationState>
    extends React.ForwardRefExoticComponent<
      React.PropsWithoutRef<NavLinkProps<S>> & React.RefAttributes<HTMLAnchorElement>
    > {}
}
