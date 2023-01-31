import {motion} from "framer-motion"

const AlertMsg: React.FC<{ msg: string }> = ({ msg }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 150 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 150 }}
    className="fixed bottom-5 left-5 bg-red-400 px-4 lg:px-8 py-2 rounded-xl
    text-lg font-semibold max-w-sm lg:max-w-lg">
      {msg}
    </motion.div>
  );
};

export default AlertMsg;
