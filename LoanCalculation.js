import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })


app.post('/api/calculateLoan', (req, res) => {
    try {
        const { loanAmount, loanTermYears, loanTermMonths, interestRate, repaymentFrequency } = req.body;
        
        // console.log('Loan Amount:', loanAmount);
        // console.log('Loan Term (Years):', loanTermYears);
        // console.log('Loan Term (Months):', loanTermMonths);
        // console.log('Interest Rate (%):', interestRate);
        // console.log('Repayment Frequency:', repaymentFrequency);

        
        if (!loanAmount || !loanTermYears || !interestRate || !repaymentFrequency) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        
        const loanTermInMonths = loanTermYears * 12 + loanTermMonths;

       
        const monthlyInterestRate = (interestRate / 100) / 12;

        
        let numberOfPayments;

        switch (repaymentFrequency) {
            case 'monthly':
                numberOfPayments = loanTermInMonths;
                break;
            case 'weekly':
                numberOfPayments = loanTermInMonths * 4; 
                break;
            case 'yearly':
                numberOfPayments = loanTermInMonths / 12;
                break;
            default:
                return res.status(400).json({ error: 'Invalid repayment frequency.' });
        }

       
        const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

        
        const totalRepayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalRepayment - loanAmount;

       
        const result = {
            repaymentAmount: monthlyPayment.toFixed(2),
            totalPayments: numberOfPayments,
            totalRepayment: totalRepayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
        };

        console.log("Calculation Result:", result);

        
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
