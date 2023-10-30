class CDUIRSMonitor {
    static ShowPage(mcdu) {
        mcdu.clearDisplay();
        mcdu.page.Current = mcdu.page.IRSMonitor;
        mcdu.setTemplate([
            ["IRS MONITOR"],
            [""],
            ["<IRS1"],
            [`\xa0${CDUIRSMonitor.getAdiruStateMessage(1)}[color]green`],
            ["<IRS2"],
            [`\xa0${CDUIRSMonitor.getAdiruStateMessage(2)}[color]green`],
            ["<IRS3"],
            [`\xa0${CDUIRSMonitor.getAdiruStateMessage(3)}[color]green`],
        ]);
        mcdu.leftInputDelay[0] = () => {
            return mcdu.getDelaySwitchPage();
        };
        mcdu.onLeftInput[0] = () => {
            CDUIRSStatus.ShowPage(mcdu, 1);
        };
        mcdu.leftInputDelay[1] = () => {
            return mcdu.getDelaySwitchPage();
        };
        mcdu.onLeftInput[1] = () => {
            CDUIRSStatus.ShowPage(mcdu, 2);
        };
        mcdu.leftInputDelay[2] = () => {
            return mcdu.getDelaySwitchPage();
        };
        mcdu.onLeftInput[2] = () => {
            CDUIRSStatus.ShowPage(mcdu, 3);
        };

        // regular update due to possible irs status change
        mcdu.page.SelfPtr = setTimeout(() => {
            if (mcdu.page.Current === mcdu.page.IRSMonitor) {
                CDUIRSMonitor.ShowPage(mcdu);
            }
        }, mcdu.PageTimeout.Default);
    }

    static getAdiruStateMessage(number) {
        const irMaint = Arinc429Word.fromSimVarValue(`L:A32NX_ADIRS_IR_${number}_MAINT_WORD`);
        let state = "INVAL";
        if(irMaint.isNormalOperation()) {
            // check for alignment if any of the 3 bits are active
            const bit15 = irMaint.getBitValue(16);
            const bit16 = irMaint.getBitValue(17);
            const bit17 = irMaint.getBitValue(18);
            if(bit15 || bit16 || bit17) {
                // Time to align is encoded as 3 bits of bit 15,16 and 17
                const numberBit15 = bit15 ? 1 : 0;
                const numberBit16 = bit16 ? 2 : 0;
                const numberBit17 = bit17 ? 4 : 0;
                state = `ALIGN TTN ${(numberBit15 + numberBit16 + numberBit17)}`;
            } else if (irMaint.getBitValue(2)) {
                state = "ATT";
            } else if(irMaint.getBitValue(3)) {
                state = "NAV";
            }
        }
        return state;
    }

}
