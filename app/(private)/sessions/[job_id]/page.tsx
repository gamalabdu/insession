
import SessionPageContent from './components/SessionPageContent';
import getJobByJobId from '@/actions/getJobByJobId';
import getUserProfileById from '@/actions/getUserProfileById';
import { Bid } from '@/types';
import { createClient } from '@/utils/supabase/server';


interface SessionPageProps {
    params: {
      job_id: string;
    }
  }


const SessionPage = async (props: SessionPageProps ) => {

    const { params } = props

    const job = await getJobByJobId(params.job_id)

    const userProfileInfo = await getUserProfileById(job.user_id)

    const supabase = createClient()

    const { data: ProposalsData, error: ProposalsError } = await supabase
    .from('bids')
    .select('*, owner:profiles!bids_user_id_fkey(*)')
    .eq('id', job.job_id )
    .returns<Bid[]>()
    .order("created_at", { ascending: false });

    console.log(job)


  return (


      <SessionPageContent job={job} userProfileInfo={userProfileInfo} proposals={ProposalsData} />


  );


}

export default SessionPage

