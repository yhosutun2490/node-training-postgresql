const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'CreditPurchase',
  tableName: 'CREDIT_Purchase',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    purchase_credits: {
      type: 'integer',
      nullable: false,
    },
    price_paid: {

    },
    credit_amount: {
      type: 'integer',
      nullable: false
    },
    price: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      name: 'created_at',
      nullable: false
    },
    purchase_at: {
      type: 'timestamp',
      updateDate: true,
      name: 'purchase_at',
      nullable: false
    }
  }
})
