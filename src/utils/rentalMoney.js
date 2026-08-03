export const rentalMoneyBreakdown = ({ rentalAmount = 0, depositAmount = 0, deductionAmount = 0 } = {}) => {
    const rent = Number(rentalAmount || 0);
    const deposit = Number(depositAmount || 0);
    const deduction = Math.min(deposit, Math.max(0, Number(deductionAmount || 0)));
    return {
        rentalAmount: rent,
        depositAmount: deposit,
        initialAmount: rent + deposit,
        deductionAmount: deduction,
        refundableAmount: Math.max(0, deposit - deduction),
    };
};
