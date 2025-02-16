const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CoachSkill",
    tableName: "Coach_Skill",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      name: {
        type: "varchar",
        length: 50,
        unique: true,
        nullable: false
      },
      create_at: {
        type: "timestamp",
        default: ()=> "CURRENT_TIMESTAMP",
        nullable: false
      }
    } 
  })