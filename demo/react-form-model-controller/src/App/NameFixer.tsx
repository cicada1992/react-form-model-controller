import { useEffect } from "react";
import { useFormOne } from "./model_and_hook"

const NameFixer: React.FC = () => {
    const { controller } = useFormOne();

    useEffect(() => {
        const unsub = controller.subscribe(['name'], (values) => {
            if (values.name === 'son') {
                controller.setValue('age', '30');
            }
            if (values.name === 'dad') {
                controller.setValue('age', '60');
            }
        })
        return () => { unsub() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null;
}
export default NameFixer;