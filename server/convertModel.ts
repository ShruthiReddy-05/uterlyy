
import * as shell from 'child_process';
import path from 'path';

export async function convertModel() {
  const modelPath = path.join(process.cwd(), 'attached_assets', 'pcos_detection_model.h5');
  const outputPath = path.join(process.cwd(), 'models', 'pcos_model');
  
  return new Promise((resolve, reject) => {
    const command = `tensorflowjs_converter --input_format=keras ${modelPath} ${outputPath}`;
    shell.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error converting model:', error);
        reject(error);
        return;
      }
      console.log('Model converted successfully');
      resolve(stdout);
    });
  });
}
