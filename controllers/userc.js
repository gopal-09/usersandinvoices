const User = require('../models/userm')
const Invoice = require('../models/invoice');
const { response } = require('express');
const createaccount = async (req, res) => {
  const { name, balances } = req.body;
  const user = new User({ name, balances });

  try {
    const result = await user.save();
    return res.json({ result }); 
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const createinvoice= async (req, res) => {
  const id=req.params.id
  const k=await User.findById(id) 
  if(!k){
    
   return res.status(500).json({ message: 'User not found' });

  }
  
  try {
    const {
      
      customerid,
      accountarray,
      totalamount,
      year
    } = req.body;
    date=new Date();
    
    const invoiceno= `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    if(accountarray.length<1)
    return res.status(500).json({ message: 'account array is empty'})
    var x=0;
    for(let i=0; i<accountarray.length; i++)
    {
      x=x+accountarray[i].amount
    }
    if(x!=totalamount)
    {
    

      return res.status(500).json({ message: 'Invalid total  amount' });

    }
    let b=true;
    for(let i=0; i<accountarray.length; i++)
    {
      let id=accountarray[i].accountid
      let a=await User.findById(id)
      if(!a)
      {
        b=false;
        return res.status(500).json({ message: 'Accountid not found' });
      }

    }


    const invoice = new Invoice({
      date, 
      customerid,
      accountarray,
      totalamount,
      invoiceno,
      year
    });
   if(x==totalamount&&accountarray.length>0&&b==true) {
   await invoice.save();
    res.status(201).json(invoice);
  }
  async function updateBalances(year,id,amount) {
    let user= await User.findById(id)
    const balanceToUpdate = user.balances.find(balance => balance.year === year);
    console.log(balanceToUpdate.balance);
if (balanceToUpdate) {
  balanceToUpdate.balance+=amount;
  
  await user.save()
}
}   
  
  for(let i=0;i<accountarray.length;i++)
  {
    updateBalances(year,accountarray[i].accountid,accountarray[i].amount);
  }
  } catch (err) {
    console.log(err);
    res.status(500).send('server Error');
  }
  
}
const invoicelist= async(req,res)=> {
  
  const { skip = 0, limit = 10, searchText = '' } = req.query;
  // Construct the pipeline for MongoDB aggregation
  const pipeline = [
    {
      $lookup: {
        from: 'Users',
        localField: 'customerid',
        foreignField: '_id',
        as: 'User',
      },
    },
    {
      $unwind: {
        path: '$User',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        date: 1,
        invoiceno: 1,
        year: 1,
        totalAmount: 1,
        'customer._id': 1,
        'User.name': 1,
        accountarray: 1,
        matchedAmount: {
          $reduce: {
            input: '$accountarray',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $cond: {
                    if: {
                      $regexMatch: {
                        input: {
                          $toString: '$$this.amount',
                        },
                        regex: searchText,
                        options: 'i',
                      },
                    },
                    then: '$$this.amount',
                    else: 0,
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { invoiceno: new RegExp(searchText, 'i') },
          { 'User.name': { $regex: searchText, $options: 'i' } },
          { matchedAmount: { $ne: 0 } },
        ],
      },
    },
    {
      $facet: {
        totalCount: [
          {
            $group: {
              _id: null,
             // count: { $sum: 1 },
            },
          },
        ],
        invoices: [
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ],
      },
    },
  ];

  try {
    const result = await Invoice.aggregate(pipeline);

    const { totalCount, invoices } = result[0];

    res.json({
      //totalCount: totalCount[0].count,
      invoices,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}

module.exports ={createaccount,createinvoice,invoicelist} ;

