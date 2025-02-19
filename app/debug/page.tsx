'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import Tiptap from 'components/Tiptap';
import { Button } from 'components/ui/Button';
import Container from 'components/elements/Container';

const Home = () => {
  const formSchema = z.object({
    content: z.string().min(1).max(99999).trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      content: `<h1>The Ancient Pyramids of Egypt</h1><p>The pyramids of Egypt are among the most iconic and enduring symbols of human civilization. Constructed over 4,500 years ago during the Old and Middle Kingdom periods, these monumental structures continue to captivate the imagination of scholars, travelers, and history enthusiasts alike. The pyramids were built as grand tombs for pharaohs and elite members of ancient Egyptian society, reflecting the civilization's profound religious beliefs and advanced engineering capabilities.</p><p></p><h2 class="text-xl font-bold">Historical Context</h2><p>The most famous pyramids were constructed during Egypt's Old Kingdom, often referred to as the "Age of the Pyramids" (circa 2686–2181 BCE). This era saw the emergence of a strong centralized state and the development of a highly organized workforce capable of undertaking such massive construction projects. The earliest known pyramid is the Step Pyramid of Djoser at Saqqara, designed by the architect Imhotep around 2670 BCE. This structure marked a significant departure from earlier mastaba tombs and laid the foundation for the later true pyramids.</p><p>The pinnacle of pyramid construction occurred during the Fourth Dynasty (circa 2613–2494 BCE), particularly under the reigns of Pharaohs Sneferu, Khufu, Khafre, and Menkaure. The Great Pyramid of Giza, built for Khufu (also known as Cheops), is the largest and most famous of all. It originally stood at 146.6 meters (481 feet) and was constructed using over two million limestone and granite blocks, each weighing several tons.</p><p></p><h2 class="text-xl font-bold">Design and Construction</h2><p>The construction of the pyramids remains a subject of fascination and debate. Ancient Egyptian builders employed a combination of skilled labor, precise planning, and ingenious techniques. Workers likely used ramps, sledges, and levers to transport and position the massive stones. The alignment of the pyramids is astonishingly precise, with the Great Pyramid aligned almost perfectly with the cardinal points of the compass.</p><p>The internal structure of the pyramids includes narrow passageways, chambers, and shafts. The king’s chamber, usually located at the heart of the pyramid, often contained a sarcophagus and grave goods intended to accompany the pharaoh into the afterlife. The intricate planning and execution of these designs demonstrate the advanced understanding of mathematics and engineering possessed by the ancient Egyptians.</p><p></p><h2 class="text-xl font-bold">Religious and Cultural Significance</h2><p>The pyramids were more than just tombs; they were profound expressions of Egyptian religious beliefs. Ancient Egyptians viewed the pharaoh as a divine intermediary between the gods and humanity. Upon death, the pharaoh was believed to ascend to the afterlife and unite with the sun god Ra. The pyramid’s shape, with its sloping sides, symbolized the rays of the sun and served as a staircase for the pharaoh’s journey to the heavens.</p><p>The construction of a pyramid was a colossal undertaking that required the mobilization of resources and labor on an unprecedented scale. Recent discoveries suggest that the workforce was composed of skilled laborers and seasonal workers rather than slaves, as previously thought. These workers were housed in nearby communities and provided with food, medical care, and tools, underscoring the complexity of ancient Egyptian society.`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/tasks/create/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: values.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <>
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Content</FormLabel> */}
                  <FormControl className='min-h-[400px]'>
                    <Tiptap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='my-4' type='submit'>
              Submit
            </Button>
          </form>
        </Form>
      </Container>
    </>
  );
};

export default Home;
