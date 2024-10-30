import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { toast } from '@/components/ui/use-toast';
import LightningFS from '@isomorphic-git/lightning-fs';

const fs = new LightningFS('fs');

interface GitConfig {
  repo: string;
  branch: string;
  token: string;
  author: {
    name: string;
    email: string;
  };
}

class GitSync {
  private config: GitConfig | null = null;

  async initialize(config: GitConfig) {
    this.config = config;
    
    try {
      // Initialize the repository
      await git.init({ fs, dir: '/' });
      await git.addRemote({
        fs,
        dir: '/',
        remote: 'origin',
        url: config.repo
      });
    } catch (error) {
      console.error('Git initialization failed:', error);
      toast({
        title: "Git Error",
        description: "Failed to initialize Git repository",
        variant: "destructive"
      });
    }
  }

  async syncChanges(fileName: string, content: string, message: string) {
    if (!this.config) {
      throw new Error('Git sync not initialized');
    }

    try {
      // Write file
      await fs.promises.writeFile(`/${fileName}`, JSON.stringify(content, null, 2));

      // Stage changes
      await git.add({ fs, dir: '/', filepath: fileName });

      // Create commit
      await git.commit({
        fs,
        dir: '/',
        message,
        author: {
          name: this.config.author.name,
          email: this.config.author.email
        }
      });

      // Push changes
      await git.push({
        fs,
        http,
        dir: '/',
        remote: 'origin',
        ref: this.config.branch,
        onAuth: () => ({ username: this.config.token })
      });

      toast({
        title: "Success",
        description: "Changes synchronized with Git repository",
      });
    } catch (error) {
      console.error('Git sync failed:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync changes with Git repository",
        variant: "destructive"
      });
      throw error;
    }
  }
}

export const gitSync = new GitSync();