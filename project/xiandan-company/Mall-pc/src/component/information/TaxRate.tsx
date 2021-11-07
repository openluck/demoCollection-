import React, {Component} from 'react';
import '../../sass/information/TaxRate.scss';
import {I18nReceiver as Receiver, I18nLocalTaxRate} from '../../i18n';
import Logo from './Logo';
// import tax from '../../assets/images/tax.png';

interface TaxRateProps {

}

interface TaxRateState {

}

class TaxRate extends Component<TaxRateProps, TaxRateState> {
    constructor(props:any) {
        super(props);
        this.state = {};
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Receiver componentName="TaxRate">
                {(i18n:I18nLocalTaxRate) => (
                    <div className="tax-rate">
                        <div className="title">{i18n.title}</div>
                        <div className="info-list">
                            {i18n.info.map((item,index) => {
                                return (
                                    <p key={index}>{item}</p>
                                )
                            })}
                        </div>
                        <table className="tax-table">
                            <thead>
                                <tr>
                                    {i18n.tableTitle.map((item,index) => {
                                        return (
                                            <th key={index} colSpan={ index=== 0? 2 : 1}>
                                                {item.title}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                            {
                                i18n.tableInfo.map((item,index) => {
                                    return (
                                        <tr>
                                            {/*<td>{item.type}</td>*/}
                                            {item.colspan > 0 ? <td rowSpan={item.colspan}className="type">
                                                <p>{item.type}</p>
                                            </td>:""}
                                            <td className="name">{item.name}</td>
                                            <td className="addValue-tax">{item.addValueTax || 13}</td>
                                            <td className="consumption-tax">{item.consumptionTax || 0}</td>
                                            <td className="crossBorder-ax">{item.crossBorderTax || 9.1}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        <Logo/>
                    </div>
                )}
            </Receiver>
        );
    }
}

export default TaxRate;