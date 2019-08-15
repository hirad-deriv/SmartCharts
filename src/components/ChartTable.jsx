import React from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { CloseBoldIcon, ItemIconMap, SymbolPlaceholderIcon } from './Icons.jsx';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-chart-table.scss';

const GroupTitleClassName = (dateKey, activeHeadKey, activeHeadTop) => {
    let TitleClassName = '';
    if (activeHeadKey === dateKey) {
        TitleClassName = activeHeadTop < 0 ? 'sticky-bottom' : 'sticky-top';
    }

    return `ciq-chart-table__panel__group--title ${TitleClassName}`;
};

const GroupContent = ({ item, isTick }) => (
    <table className={`ciq-chart-table ${isTick ? 'ciq-chart-table--tick' : ''}`}>
        <tbody>
            {item.datas.map((data, idy) => (
                <tr
                    key={`chartTable-${item.key}-${idy}`} // eslint-disable-line react/no-array-index-key
                >
                    <td>{data.Date}</td>
                    {isTick && <td>{data.Close}</td>}
                    {!isTick && [
                        <td key="td-open">{data.Open}</td>,
                        <td key="td-high">{data.High}</td>,
                        <td key="td-low">{data.Low}</td>,
                        <td key="td-close">{data.Close}</td>,
                    ]}
                    <td className="before-last-child">
                        <div className="cq-change-cell">
                            <div className={`${data.Status ? data.Status : 'up'}`}>{data.Change}</div>
                        </div>
                    </td>
                    <td>
                        <div className="cq-change-cell">
                            <div className={`cq-change ${data.Status}`} />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ChartTable = ({
    isMobile,
    tableData,
    Dialog,
    open,
    isTick,
    symbol,
    setOpen,
    updateScrollSpy,
    setScrollPanel,
    isScrolled,
    setDateElement,
    activeHeadKey,
    activeHeadTop,
}) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    const width = isTick ? '380px' : '704px';

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={`cq-dialog-overlay ${open ? 'cq-dialog-active' : ''}`} style={{ '--table-width': width }}>
            <Dialog className="cq-dialog ciq-chart-dialog">
            <>
                {isMobile && (
                    <div className="cq-titlebar">
                        {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
                        <div className="cq-title">{`${symbol.name} ${t.translate('Chart Table')}`}</div>
                        <CloseBoldIcon className="icon-close-menu" onClick={handleClose} />
                    </div>
                )
                }
                {isMobile ? '' : (
                    <table className={`ciq-chart-table ${isScrolled ? 'ciq-chart-table--scrolled' : ''}`}>
                        <thead>
                            <tr>
                                <th>{t.translate('Date')}</th>
                                {isTick
                                    ? <th>{t.translate('Tick')}</th>
                                    : (
                                        <React.Fragment>
                                            <th>{t.translate('Open')}</th>
                                            <th>{t.translate('High')}</th>
                                            <th>{t.translate('Low')}</th>
                                            <th>{t.translate('Close')}</th>
                                        </React.Fragment>
                                    )
                                }
                                <th className="before-last-child">
                                    <div className="cq-change-cell">
                                        {t.translate('Change')}
                                    </div>
                                </th>
                                <th>
                                    <CloseBoldIcon className="icon-close-menu" onClick={handleClose} />
                                </th>
                            </tr>
                        </thead>
                    </table>
                )}
                <Scrollbars
                    autoHeight
                    autoHeightMax="80vh"
                    className="ciq-chart-table__panel"
                    onScroll={updateScrollSpy}
                    ref={setScrollPanel}
                >
                    {isMobile
                        ? (
                            <table className="ciq-chart-table">
                                <tbody>
                                    {tableData.map(item => (
                                        <tr
                                            key={`chartTable-${item.date}`} // eslint-disable-line react/no-array-index-key
                                        >
                                            <td>
                                                <div>
                                                    <div className="ciq-table-date">{item.Date}</div>
                                                    <div className={`${item.Status ? item.Status : 'up'}`}>{item.Change}</div>
                                                    <div className={`cq-change ${item.Status}`} />
                                                </div>
                                                <div>
                                                    {isTick && <div><span>{t.translate('Close')}</span>{item.Close}</div>}
                                                    {!isTick
                                                    && [
                                                        <div key="item-open"><span>{t.translate('O')}</span>{item.Open}</div>,
                                                        <div key="item-high"><span>{t.translate('H')}</span>{item.High}</div>,
                                                        <div key="item-low"><span>{t.translate('L')}</span>{item.Low}</div>,
                                                        <div key="item-close"><span>{t.translate('C')}</span>{item.Close}</div>,
                                                    ]}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                        : (
                            tableData.map(item => (
                                <div
                                    key={`chartTable-group-${item.key}`}
                                    className="ciq-chart-table__panel__group"
                                    ref={el => setDateElement(el, item.date)}
                                >
                                    <div
                                        className={GroupTitleClassName(item.key, activeHeadKey, activeHeadTop)}
                                    >
                                        {item.date}
                                    </div>
                                    <div className="ciq-chart-table__panel__group--content">
                                        <GroupContent
                                            item={item}
                                            isTick={isTick}
                                        />
                                    </div>
                                </div>
                            ))
                        )
                    }
                </Scrollbars>
            </>
            </Dialog>
        </div>
    );
};

export default connect(({  chart, chartTable }) => ({
    isMobile: chart.isMobile,
    tableData: chartTable.tableData,
    Dialog: chartTable.Dialog,
    open: chartTable.open,
    isTick: chartTable.isTick,
    symbol: chartTable.symbol,
    setOpen: chartTable.setOpen,
    updateScrollSpy: chartTable.updateScrollSpy,
    setScrollPanel: chartTable.setScrollPanel,
    isScrolled: chartTable.isScrolled,
    setDateElement: chartTable.setDateElement,
    activeHeadTop: chartTable.activeHeadTop,
    activeHeadKey: chartTable.activeHeadKey,
}))(ChartTable);
