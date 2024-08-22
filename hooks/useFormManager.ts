import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

function useFormManager<T extends FieldValues>(schema: ZodSchema<T>) {
    const formOptions = { resolver: zodResolver(schema) };
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<T>(formOptions);

    const generateErrorMessages = () => {
        return Object.values(errors).map(error => error?.message as string).join(' | ');
    };

    return { register, handleSubmit, generateErrorMessages };
}

export default useFormManager;
