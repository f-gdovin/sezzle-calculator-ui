import React, { FunctionComponent } from 'react';
import { ReactComponent as ReactLogo } from '../logo.svg';
import styles from '../styles.module.css';

interface HeaderProps {
    onClick: Function;
}

const areEqual = (prevProps: any, nextProps: any) => true;

const Header: FunctionComponent<HeaderProps> = React.memo((props: HeaderProps) => {
        return <ReactLogo
            className={styles['pointy']}
            height='5em'
            preserveAspectRatio="xMinYMin"
            onClick={() => props.onClick()}/>
    }, areEqual);

export default Header;