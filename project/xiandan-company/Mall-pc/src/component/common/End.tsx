import React, {Component} from 'react';
import '../../sass/common/End.scss'

interface EndProps {
    text: string,
}

interface EndState {

}

class End extends Component<EndProps, EndState> {
    constructor(props:any) {
        super(props);
        this.state = {

        };
    }

    componentDidMount(): void {

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="end">
                <div className="border"/>
                <div className="end-text">{this.props.text}</div>
                <div className="border"/>
            </div>
        )
    }
}

export default End;