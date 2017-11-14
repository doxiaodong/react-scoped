/// <reference types="react" />
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ViewEncapsulation from './ViewEncapsulation';
export interface IReactScopedProps {
    styles?: string[];
    encapsulation?: ViewEncapsulation;
}
export default class ReactScoped extends PureComponent<IReactScopedProps, {}> {
    static propTypes: {
        style: PropTypes.Requireable<any>;
        encapsulation: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        styles: any[];
        encapsulation: ViewEncapsulation;
    };
    state: {
        currentUuid: number;
    };
    compileStyles(props: any): any;
    modifyChildren: (child: any) => any;
    render(): JSX.Element;
}
