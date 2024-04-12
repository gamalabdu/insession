
import SessionPageContent from './components/SessionPageContent';
import getJobByJobId from '@/actions/getJobByJobId';
import getUserProfileById from '@/actions/getUserProfileById';


interface SessionPageProps {
    params: {
      job_id: string;
    }
  }


const SessionPage = async (props: SessionPageProps ) => {

    const { params } = props

    const job = await getJobByJobId(params.job_id)

    const userProfileInfo = await getUserProfileById(job.user_id)


  return (


      <SessionPageContent job={job} userProfileInfo={userProfileInfo} />


  );


}

export default SessionPage

