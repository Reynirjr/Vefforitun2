/**
 * 
 * Tekur inn gögn um flokk og staðfestir að þau séu í réttu formi
 * Ef gögnin eru ekki í réttu formi skrifar fallið út villuskilaboð
 * 
 * skilar "staðfestu" object {title, question} eða null ef gögnin eru ekki í réttu formi
 *  
 */

export function validateCategory(data) {

    if (!data || typeof data.title !== 'string' || !Array.isArray(data.questions)) {
      console.log('ógilt flokka data, sleppum:', data);
      return null;
    }
    
    const validQuestions = []
  
    for (const q of data.questions) {
      if (!q || typeof q.question !== 'string' || !Array.isArray(q.answers)) {
        console.log('ógild spurning, skippidy skippum:', q);
        continue;
      }
  
      const validAnswers = [];
      for (const a of q.answers) {
        if (!a || typeof a.answer !== 'string' || typeof a.correct !== 'boolean') {
          console.log('ogilt svar, sleppum:', a);
        } else {
          validAnswers.push(a);
        }
      }
        
  
      if (validAnswers.length > 0) {
        validQuestions.push({
          question: q.question,
          answers: validAnswers,
        });
      } else {
        console.log('engin lögleg svör í spurningunni:', q.question);
      }
    }
    if (validQuestions.length === 0) {
      console.log('engar gildar spurningar, sleppum flokki:', data.title);
      return null;
    }
    return {
      title: data.title,
      questions: validQuestions,
    };
      
  }