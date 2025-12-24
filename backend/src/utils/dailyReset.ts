import cron from 'node-cron';
import pool from '../config/database';

export const startDailyReset = () => {
  // Run at 5am UTC every day
  cron.schedule('0 5 * * *', async () => {
    try {
      console.log('Running daily reset at 5am UTC...');
      
      const connection = await pool.getConnection();
      
      // Reset all selected tasks to NOT_STARTED
      await connection.query(
        `UPDATE tasks t
         INNER JOIN selected_tasks st ON t.id = st.task_id
         SET t.state = 'NOT_STARTED'
         WHERE t.state = 'COMPLETED'`
      );
      
      connection.release();
      console.log('Daily reset completed successfully');
    } catch (error) {
      console.error('Error during daily reset:', error);
    }
  });
  
  console.log('Daily reset cron job scheduled (5am UTC)');
};

