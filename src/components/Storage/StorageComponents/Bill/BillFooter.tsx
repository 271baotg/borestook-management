import React, { useState } from 'react';
import { useEffect } from 'react';
import st from '../../style/bill-footer-style.module.css'
import BillItemModel from '../../../../models/BillItemModel';
export const BillFooter: React.FC<{billItem: BillItemModel[], 
    onClickGoToCheckOut:Function }> = (props) => {
    let subtotal = 0;


    props.billItem.forEach(billItem => {
        subtotal += billItem.amount ?? 0;
    });

    const total = subtotal;

    const handleClickGoToCheckOut = () => {
        props.onClickGoToCheckOut();
    }



    return (
        <>
            <div className={st.billFooter}>
                <p>{`Subtotal: ${subtotal}`}</p>
                <p className='text-success' style={{ fontSize: 20 }}>{`Total: ${total}`}</p>
                <button className={`btn btn-success`} onClick={handleClickGoToCheckOut}>Go to Checkout</button>
            </div>
        </>
    )
}