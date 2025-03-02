const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CoachLinkSkill",
    tableName: "Coach_Link_Skill",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      coach_id: {
        type: "uuid",
        nullable: false,
      },
      skill_id: {
        type: "uuid",
        nullable: false,
      },

      create_at: {
        type: "timestamp",
        createDate: true,
        nullable: false
      },
    } ,
    // 教練id和skill id插入時必須兩兩一組不重複
    uniques: [
      {
        name: "unique_coach_skill",
        columns: ["coach_id", "skill_id"],
      },
    ],
    relations: {
      coach: {
        target: 'Coach',
        type: 'many-to-one',
        joinColumn: {
            name: "coach_id", // FK
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'coach_id_coach_fk'
        },
        inverseSide: "coachLinkSkills",
      },
      skill: {
        target: 'CoachSkill',
        type: "many-to-one",
        joinColumn: {
          name: "skill_id", // FK name
          referencedColumnName: 'id',
          foreignKeyConstraintName: 'skill_id_skill_fk'
        },
        inverseSide: "coachLinkSkills",
      },
      courses: {
        target: 'Course',
        type: 'one-to-many',
        joinColumn: {
            name: "skill_id", // FK
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'skill_id_course_fk'
        },
        inverseSide: "coachLinkSkills",
      },
    }
  })